// import { BadRequestError, NotFoundError } from "../../../common/errors";

// import { buildPagination } from "../../../common/utils";

// import type { ICourseRepository } from "../../courses/repositories";
// import type { IQuestionRepository } from "../../questions/repositories";

// import type { Exam, ExamStatus } from "@prisma/client";

// import type {
//   CreateExamDto,
//   CreatePracticeExamDto,
//   QueryExamsDto,
//   UpdateExamDto,
//   ReorderExamQuestionsDto,
// } from "../dto";

// import type { IExamRepository } from "../repositories";

// import type { IExamService, PaginatedExams } from "./exam.service.interface";

// export class ExamService implements IExamService {
//   constructor(
//     private readonly examRepository: IExamRepository,
//     private readonly courseRepository: ICourseRepository,
//     private readonly questionRepository: IQuestionRepository,
//   ) {}

//   async create(dto: CreateExamDto) {
//     const course = await this.courseRepository.findById(dto.courseId as string);

//     if (!course) {
//       throw new NotFoundError("Course not found.");
//     }

//     if (dto.endTime <= dto.startTime) {
//       throw new BadRequestError("End time must be after start time.");
//     }

//     const availableMinutes =
//       (dto.endTime.getTime() - dto.startTime.getTime()) / 60000;

//     if (dto.durationMinutes > availableMinutes) {
//       throw new BadRequestError("Duration exceeds exam time window.");
//     }

//     if (dto.passingMarks > dto.totalMarks) {
//       throw new BadRequestError("Passing marks cannot exceed total marks.");
//     }

//     return this.examRepository.create(dto);
//   }

//   async createPracticeExam(
//     userId: string,
//     dto: CreatePracticeExamDto,
//   ): Promise<Exam> {
//     // Pull a generous pool of matching questions, then randomly sample from
//     // it — this avoids always handing back the same first N questions for a
//     // given filter combination.
//     const pool = await this.questionRepository.findMany({
//       type: dto.type,
//       difficulty: dto.difficulty,
//       chapter: dto.chapter,
//       topic: dto.topic,
//       isActive: true,
//       limit: 200,
//     });

//     if (pool.length === 0) {
//       throw new BadRequestError(
//         "No questions match those filters. Try a broader chapter, topic, or difficulty.",
//       );
//     }

//     const shuffled = [...pool].sort(() => Math.random() - 0.5);
//     const selected = shuffled.slice(
//       0,
//       Math.min(dto.questionCount, shuffled.length),
//     );

//     const totalMarks = selected.reduce((sum, q) => sum + (q.marks ?? 1), 0);
//     const passingMarks = Math.max(1, Math.round(totalMarks * 0.4));

//     const now = new Date();
//     // A generous open window so the exam doesn't expire between creation and
//     // starting it, and so it stays available for a return visit — practice
//     // exams are meant to be low-stakes and always accessible to their owner.
//     const endTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

//     const title =
//       dto.title?.trim() ||
//       `Practice · ${[dto.chapter, dto.topic].filter(Boolean).join(" — ") || "Mixed topics"}`;

//     const exam = await this.examRepository.create({
//       title,
//       createdByUserId: userId,
//       isPractice: true,
//       isPublished: true,
//       startTime: now,
//       endTime,
//       durationMinutes: dto.durationMinutes,
//       totalMarks,
//       passingMarks,
//       negativeMarking: dto.negativeMarking ?? false,
//       shuffleQuestions: true,
//       shuffleOptions: true,
//       showResultImmediately: true,
//       // Practice exams are meant to be retaken freely for self-study.
//       maxAttempts: 9999,
//     });

//     await this.examRepository.attachQuestions(
//       exam.id,
//       selected.map((q) => q.id),
//     );

//     return exam;
//   }

//   async listMyPracticeExams(userId: string): Promise<Exam[]> {
//     return this.examRepository.findManyByCreator(userId);
//   }

//   async getById(id: string) {
//     const exam = await this.examRepository.findById(id);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     return exam;
//   }

//   async update(id: string, dto: UpdateExamDto) {
//     const exam = await this.getById(id);

//     if (
//       exam.isPublished &&
//       (dto.startTime || dto.endTime || dto.durationMinutes)
//     ) {
//       throw new BadRequestError("Published exams cannot modify schedule.");
//     }

//     return this.examRepository.update(id, dto);
//   }

//   async list(query: QueryExamsDto): Promise<PaginatedExams> {
//     const exams = await this.examRepository.findMany(query);

//     const total = await this.examRepository.count(query);

//     return {
//       exams,
//       pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
//     };
//   }

//   async delete(id: string): Promise<void> {
//     await this.getById(id);

//     await this.examRepository.update(id, {
//       status: "ARCHIVED",
//       isPublished: false,
//     });
//   }

//   async attachQuestions(examId: string, questionIds: string[]): Promise<void> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     if (questionIds.length === 0) {
//       throw new BadRequestError("Please select at least one question.");
//     }

//     await this.examRepository.attachQuestions(examId, questionIds);
//   }

//   async removeQuestion(examId: string, questionId: string): Promise<void> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     await this.examRepository.removeQuestion(examId, questionId);
//   }

//   async reorderQuestions(
//     examId: string,
//     dto: ReorderExamQuestionsDto,
//   ): Promise<void> {
//     const exam = await this.examRepository.findById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     await this.examRepository.reorderQuestions(examId, dto.questions);
//   }

//   async getPreview(examId: string): Promise<Exam> {
//     const exam = await this.examRepository.findPreviewById(examId);

//     if (!exam) {
//       throw new NotFoundError("Exam not found.");
//     }

//     return exam;
//   }
// }

import { BadRequestError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { ICourseRepository } from "../../courses/repositories";
import type { IQuestionRepository } from "../../questions/repositories";

import type { Exam, ExamStatus } from "@prisma/client";

import type {
  CreateExamDto,
  CreatePracticeExamDto,
  QueryExamsDto,
  UpdateExamDto,
  ReorderExamQuestionsDto,
} from "../dto";

import type { IExamRepository } from "../repositories";

import type { IExamService, PaginatedExams } from "./exam.service.interface";

export class ExamService implements IExamService {
  constructor(
    private readonly examRepository: IExamRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async create(dto: CreateExamDto) {
    const course = await this.courseRepository.findById(dto.courseId as string);

    if (!course) {
      throw new NotFoundError("Course not found.");
    }

    if (dto.endTime <= dto.startTime) {
      throw new BadRequestError("End time must be after start time.");
    }

    const availableMinutes =
      (dto.endTime.getTime() - dto.startTime.getTime()) / 60000;

    if (dto.durationMinutes > availableMinutes) {
      throw new BadRequestError("Duration exceeds exam time window.");
    }

    if (dto.passingMarks > dto.totalMarks) {
      throw new BadRequestError("Passing marks cannot exceed total marks.");
    }

    return this.examRepository.create(dto);
  }

  async createPracticeExam(
    userId: string,
    dto: CreatePracticeExamDto,
  ): Promise<Exam> {
    // Pull a generous pool of matching questions, then randomly sample from
    // it — this avoids always handing back the same first N questions for a
    // given filter combination.
    const pool = await this.questionRepository.findMany({
      type: dto.type,
      difficulty: dto.difficulty,
      chapter: dto.chapter,
      topic: dto.topic,
      isActive: true,
      limit: 200,
      scope: "own_and_shared",
      ownerId: userId,
    });

    if (pool.length === 0) {
      throw new BadRequestError(
        "No questions match those filters. Try a broader chapter, topic, or difficulty.",
      );
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(
      0,
      Math.min(dto.questionCount, shuffled.length),
    );

    const totalMarks = selected.reduce((sum, q) => sum + (q.marks ?? 1), 0);
    const passingMarks = Math.max(1, Math.round(totalMarks * 0.4));

    const now = new Date();
    // A generous open window so the exam doesn't expire between creation and
    // starting it, and so it stays available for a return visit — practice
    // exams are meant to be low-stakes and always accessible to their owner.
    const endTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const title =
      dto.title?.trim() ||
      `Practice · ${[dto.chapter, dto.topic].filter(Boolean).join(" — ") || "Mixed topics"}`;

    const exam = await this.examRepository.create({
      title,
      createdByUserId: userId,
      isPractice: true,
      isPublished: true,
      startTime: now,
      endTime,
      durationMinutes: dto.durationMinutes,
      totalMarks,
      passingMarks,
      negativeMarking: dto.negativeMarking ?? false,
      shuffleQuestions: true,
      shuffleOptions: true,
      showResultImmediately: true,
      // Practice exams are meant to be retaken freely for self-study.
      maxAttempts: 9999,
    });

    await this.examRepository.attachQuestions(
      exam.id,
      selected.map((q) => q.id),
    );

    return exam;
  }

  async listMyPracticeExams(userId: string): Promise<Exam[]> {
    return this.examRepository.findManyByCreator(userId);
  }

  async getById(id: string) {
    const exam = await this.examRepository.findById(id);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    return exam;
  }

  async update(id: string, dto: UpdateExamDto) {
    const exam = await this.getById(id);

    if (
      exam.isPublished &&
      (dto.startTime || dto.endTime || dto.durationMinutes)
    ) {
      throw new BadRequestError("Published exams cannot modify schedule.");
    }

    return this.examRepository.update(id, dto);
  }

  async list(query: QueryExamsDto): Promise<PaginatedExams> {
    const exams = await this.examRepository.findMany(query);

    const total = await this.examRepository.count(query);

    return {
      exams,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.examRepository.update(id, {
      status: "ARCHIVED",
      isPublished: false,
    });
  }

  async attachQuestions(examId: string, questionIds: string[]): Promise<void> {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    if (questionIds.length === 0) {
      throw new BadRequestError("Please select at least one question.");
    }

    await this.examRepository.attachQuestions(examId, questionIds);
  }

  async removeQuestion(examId: string, questionId: string): Promise<void> {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    await this.examRepository.removeQuestion(examId, questionId);
  }

  async reorderQuestions(
    examId: string,
    dto: ReorderExamQuestionsDto,
  ): Promise<void> {
    const exam = await this.examRepository.findById(examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    await this.examRepository.reorderQuestions(examId, dto.questions);
  }

  async getPreview(examId: string): Promise<Exam> {
    const exam = await this.examRepository.findPreviewById(examId);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    return exam;
  }
}