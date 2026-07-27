import { ConflictError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type {
  CreateSubjectDto,
  QuerySubjectsDto,
  UpdateSubjectDto,
} from "../dto";

import type { ISubjectRepository } from "../repositories";

import type {
  ISubjectService,
  PaginatedSubjects,
} from "./subject.service.interface";

export class SubjectService implements ISubjectService {
  constructor(private readonly subjectRepository: ISubjectRepository) {}

  async create(dto: CreateSubjectDto) {
    if (dto.code) {
      const existing = await this.subjectRepository.findByCode(dto.code);

      if (existing) {
        throw new ConflictError("Subject code already exists.");
      }
    }

    return this.subjectRepository.create(dto);
  }

  async getById(id: string) {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new NotFoundError("Subject not found.");
    }

    return subject;
  }

  async update(id: string, dto: UpdateSubjectDto) {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.subjectRepository.findByCode(dto.code);

      if (existing && existing.id !== id) {
        throw new ConflictError("Subject code already exists.");
      }
    }

    return this.subjectRepository.update(id, dto);
  }

  async list(query: QuerySubjectsDto): Promise<PaginatedSubjects> {
    const subjects = await this.subjectRepository.findMany(query);

    const total = await this.subjectRepository.count(query);

    return {
      subjects,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.subjectRepository.softDelete(id);
  }
}
