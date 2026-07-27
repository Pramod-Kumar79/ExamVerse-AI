// import { DocumentStatus } from "@prisma/client";

// export interface QueryDocumentsDto {
//   page?: number;

//   limit?: number;

//   search?: string;

//   status?: DocumentStatus;

//   uploadedById?: string;
// }

import { DocumentStatus, UserRole } from "@prisma/client";

export interface QueryDocumentsDto {
  page?: number;

  limit?: number;

  search?: string;

  status?: DocumentStatus;

  uploadedById?: string;

  // Excludes documents uploaded by users with this role — used so the
  // shared teacher/admin document list never shows a student's personal
  // uploads.
  excludeUploaderRole?: UserRole;
}