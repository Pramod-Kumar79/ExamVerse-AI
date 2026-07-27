import { ProcessingStatus, DocumentStatus } from "@prisma/client";
import { logger } from "../../../lib/logger";
import { NotFoundError } from "../../../common/errors";

import type { IProcessingJobRepository } from "../repositories";
import type { IDocumentRepository } from "../../documents/repositories";

import type { IPdfProcessingService } from "../../pdf-processing/services";
import type { IOcrService } from "../../ocr/services";
import type { IQuestionExtractionService } from "../../ai/services";
import type { IAIReviewService } from "../../ai-review/services";
import type { IProcessingPipelineService } from "./processing-pipeline.service.interface";
// Assuming it lives in the same repositories folder; adjust the path if necessary
// import type { IExtractedQuestionRepository } from "../repositories";

export class ProcessingPipelineService implements IProcessingPipelineService {
  constructor(
    private readonly processingRepository: IProcessingJobRepository,
    private readonly documentRepository: IDocumentRepository,
    private readonly pdfProcessingService: IPdfProcessingService,
    private readonly ocrService: IOcrService,
    private readonly questionExtractionService: IQuestionExtractionService,
    private readonly aiReviewService: IAIReviewService,
  ) {}

  async process(jobId: string): Promise<void> {
    const job = await this.processingRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError("Processing job not found.");
    }

    const document = await this.documentRepository.findById(job.documentId);

    if (!document) {
      throw new NotFoundError("Document not found.");
    }

    await this.processingRepository.update(jobId, {
      status: ProcessingStatus.RUNNING,
    });

    await this.documentRepository.update(job.documentId, {
      status: DocumentStatus.READY_FOR_PROCESSING,
    });

    try {
      // Step 3 — Pipeline integration
      //   const pdf = await this.pdfProcessingService.analyzeDocument(
      //     job.documentId,
      //   );

      const pdf = await this.pdfProcessingService.analyzeDocument(
        document.storagePath,
      );

      logger.info(
        {
          requiresOcr: pdf.requiresOcr,
          pages: pdf.pages.length,
        },
        "PDF analysis completed.",
      );

      // const pdf =  await this.pdfProcessingService.analyzeDocument(
      //     document.storagePath,
      //     );

      let pages = pdf.pages;

      if (pdf.requiresOcr) {
        await this.documentRepository.update(job.documentId, {
          status: DocumentStatus.OCR_RUNNING,
        });

        const ocr = await this.ocrService.extractDocument(job.documentId);

        pages = ocr.pages;
      }

      await this.documentRepository.update(job.documentId, {
        status: DocumentStatus.AI_RUNNING,
      });

      //   const extraction =
      //     await this.questionExtractionService.extractQuestions(pages);

      const text = pages.map((page) => page.text).join("\n\n");

      const extraction =
        await this.questionExtractionService.extractQuestions(text);

      await this.aiReviewService.saveExtractedQuestions(
        job.id,
        document.id,
        extraction.questions,
      );
      logger.info(
        {
          totalQuestions: extraction.questions.length,
        },
        "Question extraction completed.",
      );
      //   await this.extractedQuestionRepository.create({
      //     processingJobId: job.id,
      //     rawResponse: extraction,
      //     totalQuestions: extraction.questions.length,
      //     provider: "gemini",
      //   });

      logger.info(
        {
          jobId,
        },
        "Processing pipeline completed successfully.",
      );
      await this.processingRepository.update(jobId, {
        status: ProcessingStatus.COMPLETED,
      });

      await this.documentRepository.update(job.documentId, {
        status: DocumentStatus.REVIEW_PENDING,
      });
    } catch (error) {
      await this.processingRepository.update(jobId, {
        status: ProcessingStatus.FAILED,
      });

      await this.documentRepository.update(job.documentId, {
        status: DocumentStatus.FAILED,
      });

      logger.error(
        {
          err: error,
          jobId,
        },
        "Processing pipeline failed.",
      );

      throw error;
    }
  }
}

// logger.info("PDF processing completed.");
// logger.info("OCR completed.");
// logger.info("Question extraction started.");
// logger.info("Question extraction completed.");
// logger.info("Pipeline completed.");