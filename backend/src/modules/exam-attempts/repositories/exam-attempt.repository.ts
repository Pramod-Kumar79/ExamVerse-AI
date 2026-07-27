// import type { ExamAttempt, Prisma } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { AttemptStatus } from "@prisma/client";

// import type { IExamAttemptRepository } from "./exam-attempt.repository.interface";

// export class ExamAttemptRepository implements IExamAttemptRepository {
//   async createAttempt(examId: string, studentId: string): Promise<ExamAttempt> {
//     return prisma.examAttempt.create({
//       data: {
//         examId,

//         studentId,

//         startedAt: new Date(),
//       },
//     });
//   }

//   async findById(id: string): Promise<ExamAttempt | null> {
//     return prisma.examAttempt.findUnique({
//       where: {
//         id,
//       },
//     });
//   }

//   async saveAnswer(
//     attemptId: string,
//     questionId: string,
//     answer: Prisma.InputJsonValue,
//   ): Promise<void> {
//     const attempt = await prisma.examAttempt.findUnique({
//       where: {
//         id: attemptId,
//       },

//       select: {
//         studentId: true,
//       },
//     });

//     if (!attempt) {
//       throw new Error("Exam attempt not found.");
//     }

//     await prisma.studentAnswer.upsert({
//       where: {
//         attemptId_questionId: {
//           attemptId,
//           questionId,
//         },
//       },

//       update: {
//         answer,
//       },

//       create: {
//         attemptId,
//         questionId,
//         answer,
//         evaluated: false,
//       },
//     });
//   }

//   async findAttemptWithExam(id: string): Promise<ExamAttempt | null> {
//     return prisma.examAttempt.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         exam: {
//           include: {
//             examQuestions: {
//               orderBy: {
//                 displayOrder: "asc",
//               },

//               include: {
//                 question: {
//                   include: {
//                     options: {
//                       orderBy: {
//                         displayOrder: "asc",
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },

//         answers: true,
//       },
//     });
//   }

//   async submitAttempt(id: string): Promise<void> {
//     await prisma.examAttempt.update({
//       where: {
//         id,
//       },

//       data: {
//         status: AttemptStatus.SUBMITTED,

//         submittedAt: new Date(),
//       },
//     });
//   }
// }

// import type { ExamAttempt, Prisma } from "@prisma/client";

// import { prisma } from "../../../lib/prisma";

// import { AttemptStatus } from "@prisma/client";

// import type { IExamAttemptRepository } from "./exam-attempt.repository.interface";

// export class ExamAttemptRepository implements IExamAttemptRepository {
//   async createAttempt(examId: string, studentId: string): Promise<ExamAttempt> {
//     return prisma.examAttempt.create({
//       data: {
//         examId,

//         studentId,

//         startedAt: new Date(),
//       },
//     });
//   }

//   async findById(id: string): Promise<ExamAttempt | null> {
//     return prisma.examAttempt.findUnique({
//       where: {
//         id,
//       },
//     });
//   }

//   async findByExamAndStudent(
//     examId: string,
//     studentId: string,
//   ): Promise<ExamAttempt[]> {
//     return prisma.examAttempt.findMany({
//       where: {
//         examId,
//         studentId,
//       },
//       orderBy: {
//         startedAt: "desc",
//       },
//     });
//   }

//   async findManyByExam(examId: string): Promise<ExamAttempt[]> {
//     return prisma.examAttempt.findMany({
//       where: {
//         examId,
//       },
//       include: {
//         student: {
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         startedAt: "desc",
//       },
//     });
//   }

//   async saveAnswer(
//     attemptId: string,
//     questionId: string,
//     answer: Prisma.InputJsonValue,
//   ): Promise<void> {
//     const attempt = await prisma.examAttempt.findUnique({
//       where: {
//         id: attemptId,
//       },

//       select: {
//         studentId: true,
//       },
//     });

//     if (!attempt) {
//       throw new Error("Exam attempt not found.");
//     }

//     await prisma.studentAnswer.upsert({
//       where: {
//         attemptId_questionId: {
//           attemptId,
//           questionId,
//         },
//       },

//       update: {
//         answer,
//       },

//       create: {
//         attemptId,
//         questionId,
//         answer,
//         evaluated: false,
//       },
//     });
//   }

//   async findAttemptWithExam(id: string): Promise<ExamAttempt | null> {
//     return prisma.examAttempt.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         exam: {
//           include: {
//             examQuestions: {
//               orderBy: {
//                 displayOrder: "asc",
//               },

//               include: {
//                 question: {
//                   include: {
//                     options: {
//                       orderBy: {
//                         displayOrder: "asc",
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },

//         answers: true,
//       },
//     });
//   }

//   async submitAttempt(id: string): Promise<void> {
//     await prisma.examAttempt.update({
//       where: {
//         id,
//       },

//       data: {
//         status: AttemptStatus.SUBMITTED,

//         submittedAt: new Date(),
//       },
//     });
//   }
// }

import type { ExamAttempt, Prisma } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import { AttemptStatus } from "@prisma/client";

import type { IExamAttemptRepository } from "./exam-attempt.repository.interface";

export class ExamAttemptRepository implements IExamAttemptRepository {
  async createAttempt(examId: string, studentId: string): Promise<ExamAttempt> {
    return prisma.examAttempt.create({
      data: {
        examId,

        studentId,

        startedAt: new Date(),
      },
    });
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    return prisma.examAttempt.findUnique({
      where: {
        id,
      },
    });
  }

  async findByExamAndStudent(
    examId: string,
    studentId: string,
  ): Promise<ExamAttempt[]> {
    return prisma.examAttempt.findMany({
      where: {
        examId,
        studentId,
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  }

  async findManyByStudent(studentId: string): Promise<ExamAttempt[]> {
    return prisma.examAttempt.findMany({
      where: {
        studentId,
      },
      include: {
        exam: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  }

  async findManyByExam(examId: string): Promise<ExamAttempt[]> {
    return prisma.examAttempt.findMany({
      where: {
        examId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  }

  async saveAnswer(
    attemptId: string,
    questionId: string,
    answer: Prisma.InputJsonValue,
  ): Promise<void> {
    const attempt = await prisma.examAttempt.findUnique({
      where: {
        id: attemptId,
      },

      select: {
        studentId: true,
      },
    });

    if (!attempt) {
      throw new Error("Exam attempt not found.");
    }

    await prisma.studentAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },

      update: {
        answer,
      },

      create: {
        attemptId,
        questionId,
        answer,
        evaluated: false,
      },
    });
  }

  async findAttemptWithExam(id: string): Promise<ExamAttempt | null> {
    return prisma.examAttempt.findUnique({
      where: {
        id,
      },

      include: {
        exam: {
          include: {
            examQuestions: {
              orderBy: {
                displayOrder: "asc",
              },

              include: {
                question: {
                  include: {
                    options: {
                      orderBy: {
                        displayOrder: "asc",
                      },
                    },
                  },
                },
              },
            },
          },
        },

        answers: true,
      },
    });
  }

  async submitAttempt(id: string): Promise<void> {
    await prisma.examAttempt.update({
      where: {
        id,
      },

      data: {
        status: AttemptStatus.SUBMITTED,

        submittedAt: new Date(),
      },
    });
  }
}