import { ConflictError, NotFoundError } from "../../../common/errors";

import { buildPagination } from "../../../common/utils";

import type {
  CreateStudentDto,
  QueryStudentsDto,
  UpdateStudentDto,
} from "../dto";

import type { IStudentRepository } from "../repositories";
import type { IUserRepository } from "../../users/repositories";
import type { IBatchRepository } from "../../batches/repositories";

import type {
  IStudentService,
  PaginatedStudents,
} from "./student.service.interface";

export class StudentService implements IStudentService {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly userRepository: IUserRepository,
    private readonly batchRepository: IBatchRepository,
  ) {}

  async create(dto: CreateStudentDto) {

    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const batch = await this.batchRepository.findById(dto.batchId);

    if (!batch) {
      throw new NotFoundError("Batch not found.");
    }

    const existingUser = await this.studentRepository.findByUserId(dto.userId);

    if (existingUser) {
      throw new ConflictError("Student profile already exists.");
    }

    if (dto.rollNumber) {
      const existingRoll = await this.studentRepository.findByRollNumber(
        dto.rollNumber,
      );

      if (existingRoll) {
        throw new ConflictError("Roll number already exists.");
      }
    }

    return this.studentRepository.create(dto);
  }

  async getById(id: string) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundError("Student not found.");
    }

    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.getById(id);

    if (dto.rollNumber) {
      const existing = await this.studentRepository.findByRollNumber(
        dto.rollNumber,
      );

      if (existing && existing.id !== id) {
        throw new ConflictError("Roll number already exists.");
      }
    }

    return this.studentRepository.update(id, dto);
  }

  async list(query: QueryStudentsDto): Promise<PaginatedStudents> {
    const students = await this.studentRepository.findMany(query);

    const total = await this.studentRepository.count(query);

    return {
      students,
      pagination: buildPagination(query.page ?? 1, query.limit ?? 10, total),
    };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);

    await this.studentRepository.delete(id);
  }
}
