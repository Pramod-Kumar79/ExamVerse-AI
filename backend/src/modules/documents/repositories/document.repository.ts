// import type { Prisma, PrismaClient, UploadedDocument } from "@prisma/client";

// import { resolvePagination } from "../../../common/utils";

// import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

// import type { IDocumentRepository } from "./document.repository.interface";

// export class DocumentRepository implements IDocumentRepository {
//   constructor(private readonly prisma: PrismaClient) {}

//   async create(
//     data: Prisma.UploadedDocumentCreateInput,
//   ): Promise<UploadedDocument> {
//     return this.prisma.uploadedDocument.create({
//       data,
//     });
//   }

//   async findById(id: string): Promise<UploadedDocument | null> {
//     return this.prisma.uploadedDocument.findUnique({
//       where: { id },

//       include: {
//         uploadedBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//       },
//     });
//   }

//   async update(id: string, data: UpdateDocumentDto): Promise<UploadedDocument> {
//     return this.prisma.uploadedDocument.update({
//       where: { id },
//       data,
//     });
//   }

//   async findMany(query: QueryDocumentsDto): Promise<UploadedDocument[]> {
//     const { page, limit } = resolvePagination(query.page, query.limit);

//     const where: Prisma.UploadedDocumentWhereInput = {
//       status: query.status,

//       uploadedById: query.uploadedById,

//       ...(query.search && {
//         originalName: {
//           contains: query.search,
//           mode: "insensitive",
//         },
//       }),
//     };

//     return this.prisma.uploadedDocument.findMany({
//       where,

//       skip: (page - 1) * limit,

//       take: limit,

//       orderBy: {
//         createdAt: "desc",
//       },

//       include: {
//         uploadedBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             role: true,
//           },
//         },
//       },
//     });
//   }

//   async count(query: QueryDocumentsDto): Promise<number> {
//     const where: Prisma.UploadedDocumentWhereInput = {
//       status: query.status,

//       uploadedById: query.uploadedById,

//       ...(query.search && {
//         originalName: {
//           contains: query.search,
//           mode: "insensitive",
//         },
//       }),
//     };

//     return this.prisma.uploadedDocument.count({
//       where,
//     });
//   }

//   async delete(id: string): Promise<UploadedDocument> {
//     return this.prisma.uploadedDocument.delete({
//       where: { id },
//     });
//   }
// }



import type { Prisma, PrismaClient, UploadedDocument } from "@prisma/client";

import { resolvePagination } from "../../../common/utils";

import type { QueryDocumentsDto, UpdateDocumentDto } from "../dto";

import type { IDocumentRepository } from "./document.repository.interface";

export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: Prisma.UploadedDocumentCreateInput,
  ): Promise<UploadedDocument> {
    return this.prisma.uploadedDocument.create({
      data,
    });
  }

  async findById(id: string): Promise<UploadedDocument | null> {
    return this.prisma.uploadedDocument.findUnique({
      where: { id },

      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateDocumentDto): Promise<UploadedDocument> {
    return this.prisma.uploadedDocument.update({
      where: { id },
      data,
    });
  }

  async findMany(query: QueryDocumentsDto): Promise<UploadedDocument[]> {
    const { page, limit } = resolvePagination(query.page, query.limit);

    const where: Prisma.UploadedDocumentWhereInput = {
      status: query.status,

      uploadedById: query.uploadedById,

      ...(query.excludeUploaderRole && {
        uploadedBy: { role: { not: query.excludeUploaderRole } },
      }),

      ...(query.search && {
        originalName: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    return this.prisma.uploadedDocument.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async count(query: QueryDocumentsDto): Promise<number> {
    const where: Prisma.UploadedDocumentWhereInput = {
      status: query.status,

      uploadedById: query.uploadedById,

      ...(query.excludeUploaderRole && {
        uploadedBy: { role: { not: query.excludeUploaderRole } },
      }),

      ...(query.search && {
        originalName: {
          contains: query.search,
          mode: "insensitive",
        },
      }),
    };

    return this.prisma.uploadedDocument.count({
      where,
    });
  }

  async delete(id: string): Promise<UploadedDocument> {
    return this.prisma.uploadedDocument.delete({
      where: { id },
    });
  }
}
