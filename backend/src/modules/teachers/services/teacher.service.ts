import { ConflictError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type { IUserRepository } from "../../users/repositories";

import type {
  CreateTeacherDto,
  QueryTeachersDto,
  UpdateTeacherDto,
} from "../dto";

import type { ITeacherRepository } from "../repositories";

import type {
  ITeacherService,
  PaginatedTeachers,
} from "./teacher.service.interface";

export class TeacherService implements ITeacherService {
  constructor(
    private readonly teacherRepository: ITeacherRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async create(dto: CreateTeacherDto) {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const existing = await this.teacherRepository.findByUserId(dto.userId);

    if (existing) {
      throw new ConflictError("Teacher profile already exists.");
    }

    return this.teacherRepository.create(dto);
  }

  async getById(id: string) {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundError("Teacher not found.");
    }

    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    await this.getById(id);

    return this.teacherRepository.update(id, dto);
  }

  async list(query: QueryTeachersDto): Promise<PaginatedTeachers> {
    const teachers = await this.teacherRepository.findMany(query);

    const total = await this.teacherRepository.count(query);

    return {
      teachers,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.teacherRepository.delete(id);
  }
}
