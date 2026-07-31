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
//       scope: "own_and_shared",
//       ownerId: userId,
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

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { ICourseRepository } from "../../courses/repositories";
import type { IQuestionRepository } from "../../questions/repositories";

import { UserRole, type Exam } from "@prisma/client";

import type {
  CreateExamDto,
  CreatePracticeExamDto,
  QueryExamsDto,
  UpdateExamDto,
  ReorderExamQuestionsDto,
} from "../dto";

import type { IExamRepository } from "../repositories";

import type {
  IExamService,
  PaginatedExams,
  RequestingUser,
} from "./exam.service.interface";

export class ExamService implements IExamService {
  constructor(
    private readonly examRepository: IExamRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly questionRepository: IQuestionRepository,
  ) {}

  private assertOwnership(
    exam: Exam & {
      course?: {
        instituteId?: string | null;
        teacher?: { userId: string } | null;
      } | null;
    },
    requestingUser?: RequestingUser,
  ): void {
    if (!requestingUser) return;

    if (requestingUser.role === UserRole.TEACHER) {
      const isCreator = exam.createdByUserId === requestingUser.id;
      const isCourseTeacher = exam.course?.teacher?.userId === requestingUser.id;
      if (!isCreator && !isCourseTeacher) {
        throw new ForbiddenError("You do not have permission to access this exam.");
      }
    }

    if (requestingUser.role === UserRole.INSTITUTE && requestingUser.instituteId) {
      const isInstituteCourse = exam.course?.instituteId === requestingUser.instituteId;
      if (!isInstituteCourse) {
        throw new ForbiddenError("You do not have permission to access this exam.");
      }
    }
  }

  async create(dto: CreateExamDto, createdByUserId?: string) {
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

    return this.examRepository.create({
      ...dto,
      ...(createdByUserId && { createdByUserId }),
    });
  }

  async createPracticeExam(
    userId: string,
    dto: CreatePracticeExamDto,
  ): Promise<Exam> {
    let selected: { id: string; marks: number | null }[];

    if (dto.questionIds && dto.questionIds.length > 0) {
      const candidates = await Promise.all(
        dto.questionIds.map((id) => this.questionRepository.findById(id)),
      );

      type CandidateWithCreator = {
        id: string;
        marks: number | null;
        createdById: string;
        createdBy?: { role: string };
      };

      selected = (
        candidates as unknown as (CandidateWithCreator | null)[]
      ).filter(
        (q): q is CandidateWithCreator =>
          Boolean(q) &&
          (q!.createdById === userId || q!.createdBy?.role !== "STUDENT"),
      );

      if (selected.length === 0) {
        throw new BadRequestError(
          "None of the selected questions could be found in your bank or the shared bank.",
        );
      }
    } else {
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
      selected = shuffled.slice(
        0,
        Math.min(dto.questionCount ?? 10, shuffled.length),
      );
    }

    const totalMarks = selected.reduce((sum, q) => sum + (q.marks ?? 1), 0);
    const passingMarks = Math.max(1, Math.round(totalMarks * 0.4));

    const now = new Date();
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

  async getById(id: string, requestingUser?: RequestingUser) {
    const exam = await this.examRepository.findById(id);

    if (!exam) {
      throw new NotFoundError("Exam not found.");
    }

    this.assertOwnership(exam as any, requestingUser);

    return exam;
  }

  async update(
    id: string,
    dto: UpdateExamDto,
    requestingUser?: RequestingUser,
  ) {
    const exam = await this.getById(id, requestingUser);

    if (
      exam.isPublished &&
      (dto.startTime || dto.endTime || dto.durationMinutes)
    ) {
      throw new BadRequestError("Published exams cannot modify schedule.");
    }

    return this.examRepository.update(id, dto);
  }

  async list(
    query: QueryExamsDto,
    requestingUser?: RequestingUser,
  ): Promise<PaginatedExams> {
    const effectiveQuery = { ...query };

    if (requestingUser?.role === UserRole.TEACHER) {
      effectiveQuery.creatorUserId = requestingUser.id;
      effectiveQuery.teacherUserId = requestingUser.id;
    } else if (
      requestingUser?.role === UserRole.INSTITUTE &&
      requestingUser.instituteId
    ) {
      effectiveQuery.instituteId = requestingUser.instituteId;
    }

    const exams = await this.examRepository.findMany(effectiveQuery);

    const total = await this.examRepository.count(effectiveQuery);

    return {
      exams,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string, requestingUser?: RequestingUser): Promise<void> {
    await this.getById(id, requestingUser);

    await this.examRepository.update(id, {
      status: "ARCHIVED",
      isPublished: false,
    });
  }

  async attachQuestions(
    examId: string,
    questionIds: string[],
    requestingUser?: RequestingUser,
  ): Promise<void> {
    await this.getById(examId, requestingUser);

    if (questionIds.length === 0) {
      throw new BadRequestError("Please select at least one question.");
    }

    await this.examRepository.attachQuestions(examId, questionIds);
  }

  async removeQuestion(
    examId: string,
    questionId: string,
    requestingUser?: RequestingUser,
  ): Promise<void> {
    await this.getById(examId, requestingUser);

    await this.examRepository.removeQuestion(examId, questionId);
  }

  async reorderQuestions(
    examId: string,
    dto: ReorderExamQuestionsDto,
    requestingUser?: RequestingUser,
  ): Promise<void> {
    await this.getById(examId, requestingUser);

    await this.examRepository.reorderQuestions(examId, dto.questions);
  }

  async getPreview(
    examId: string,
    requestingUser?: RequestingUser,
  ): Promise<Exam> {
    const exam = await this.getById(examId, requestingUser);

    const preview = await this.examRepository.findPreviewById(exam.id);

    if (!preview) {
      throw new NotFoundError("Exam not found.");
    }

    return preview;
  }
}