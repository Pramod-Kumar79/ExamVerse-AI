// import type { UploadedDocument } from "@prisma/client";

// import type { PaginationDto } from "../../../common/dto";

// import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

// import type { StoredFile } from "../storage";

// export interface PaginatedDocuments {
//   documents: UploadedDocument[];

//   pagination: PaginationDto;
// }

// export interface IDocumentService {
//   upload(file: StoredFile, uploadedById: string): Promise<UploadedDocument>;

//   getById(id: string): Promise<UploadedDocument>;

//   list(query: QueryDocumentsDto): Promise<PaginatedDocuments>;

//   update(id: string, dto: UpdateDocumentDto): Promise<UploadedDocument>;

//   delete(id: string): Promise<void>;
// }

import type { UploadedDocument, UserRole } from "@prisma/client";

import type { PaginationDto } from "../../../common/dto";

import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

import type { StoredFile } from "../storage";

export interface PaginatedDocuments {
  documents: UploadedDocument[];

  pagination: PaginationDto;
}

export interface RequestingUser {
  id: string;
  role: UserRole;
}

export interface IDocumentService {
  upload(file: StoredFile, uploadedById: string): Promise<UploadedDocument>;

  getById(
    id: string,
    requestingUser?: RequestingUser,
  ): Promise<UploadedDocument>;

  list(query: QueryDocumentsDto): Promise<PaginatedDocuments>;

  update(
    id: string,
    dto: UpdateDocumentDto,
    requestingUser?: RequestingUser,
  ): Promise<UploadedDocument>;

  delete(id: string, requestingUser?: RequestingUser): Promise<void>;
}