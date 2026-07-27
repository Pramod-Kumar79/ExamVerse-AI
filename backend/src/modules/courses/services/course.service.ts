import { ConflictError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { IInstituteRepository } from "../../institutes/repositories";
import type { ISubjectRepository } from "../../subjects/repositories";
import type { ITeacherRepository } from "../../teachers/repositories";
import type { IBatchRepository } from "../../batches/repositories";

import type { CreateCourseDto, QueryCoursesDto, UpdateCourseDto } from "../dto";

import type { ICourseRepository } from "../repositories";

import type {
  ICourseService,
  PaginatedCourses,
} from "./course.service.interface";

export class CourseService implements ICourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instituteRepository: IInstituteRepository,
    private readonly subjectRepository: ISubjectRepository,
    private readonly teacherRepository: ITeacherRepository,
    private readonly batchRepository: IBatchRepository,
  ) {}

  async create(dto: CreateCourseDto) {
    const institute = await this.instituteRepository.findById(dto.instituteId);

    if (!institute) {
      throw new NotFoundError("Institute not found.");
    }

    const subject = await this.subjectRepository.findById(dto.subjectId);

    if (!subject) {
      throw new NotFoundError("Subject not found.");
    }

    const teacher = await this.teacherRepository.findById(dto.teacherId);

    if (!teacher) {
      throw new NotFoundError("Teacher not found.");
    }

    const batch = await this.batchRepository.findById(dto.batchId);

    if (!batch) {
      throw new NotFoundError("Batch not found.");
    }

    const existing = await this.courseRepository.findByCode(dto.code);

    if (existing) {
      throw new ConflictError("Course code already exists.");
    }

    return this.courseRepository.create(dto);
  }

  async getById(id: string) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError("Course not found.");
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.courseRepository.findByCode(dto.code);

      if (existing && existing.id !== id) {
        throw new ConflictError("Course code already exists.");
      }
    }

    return this.courseRepository.update(id, dto);
  }

  async list(query: QueryCoursesDto): Promise<PaginatedCourses> {
    const courses = await this.courseRepository.findMany(query);

    const total = await this.courseRepository.count(query);

    return {
      courses,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.courseRepository.softDelete(id);
  }
}
