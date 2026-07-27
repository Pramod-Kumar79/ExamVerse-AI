import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",

    info: {
      title: "ExamVerse AI API",
      version: "1.0.0",
      description: "REST API documentation for the ExamVerse AI Backend.",
    },

    servers: [
      {
        url: "http://localhost:5001/api",
        description: "Development Server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication and session management",
      },
      {
        name: "Users",
        description: "User profile and account management",
      },
      {
        name: "Subjects",
        description: "Subject management",
      },
      {
        name: "Batches",
        description: "Batch management",
      },
      {
        name: "Students",
        description: "Student profile management",
      },
      {
        name: "Teachers",
        description: "Teacher profile management",
      },
      {
        name: "Courses",
        description: "Course management",
      },
      {
        name: "Exams",
        description: "Examination management",
      },
      {
        name: "Questions",
        description: "Question Bank management",
      },
      {
        name: "Documents",
        description: "Document upload and management",
      },
      {
        name: "Processing Jobs",
        description: "Document processing queue management",
      },
      {
        name: "PDF Processing",
        description: "Analyze uploaded PDF documents",
      },
      {
        name: "OCR",
        description: "Optical Character Recognition",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        UpdateProfileRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Pramod Kumar",
            },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.png",
            },
          },
        },

        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: {
              type: "string",
              example: "OldPassword@123",
            },
            newPassword: {
              type: "string",
              example: "NewPassword@123",
            },
          },
        },
        CreateInstituteRequest: {
          type: "object",
          required: ["name", "code"],
          properties: {
            name: {
              type: "string",
              example: "Indian Institute of Technology Kharagpur",
            },
            code: {
              type: "string",
              example: "IITKGP",
            },
            address: {
              type: "string",
              example: "Kharagpur, West Bengal",
            },
            website: {
              type: "string",
              example: "https://www.iitkgp.ac.in",
            },
          },
        },
        UpdateInstituteRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Indian Institute of Technology Kharagpur",
            },
            code: {
              type: "string",
              example: "IITKGP",
            },
            address: {
              type: "string",
              example: "Kharagpur, West Bengal",
            },
            website: {
              type: "string",
              example: "https://www.iitkgp.ac.in",
            },
          },
        },
        CreateSubjectRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "Physics",
            },
            code: {
              type: "string",
              example: "PHY101",
            },
          },
        },

        UpdateSubjectRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Advanced Physics",
            },
            code: {
              type: "string",
              example: "PHY201",
            },
          },
        },
        CreateBatchRequest: {
          type: "object",
          required: ["name", "instituteId"],
          properties: {
            name: {
              type: "string",
              example: "B.Tech CSE 2026",
            },
            code: {
              type: "string",
              example: "CSE-2026",
            },
            instituteId: {
              type: "string",
              example: "cmr123abc",
            },
            academicYear: {
              type: "string",
              example: "2026-2027",
            },
            semester: {
              type: "number",
              example: 1,
            },
            startDate: {
              type: "string",
              format: "date-time",
            },
            endDate: {
              type: "string",
              format: "date-time",
            },
          },
        },

        UpdateBatchRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Updated Batch Name",
            },
            code: {
              type: "string",
              example: "CSE-2026-UPDATED",
            },
            academicYear: {
              type: "string",
              example: "2026-2027",
            },
            semester: {
              type: "number",
              example: 2,
            },
            startDate: {
              type: "string",
              format: "date-time",
            },
            endDate: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CreateStudentRequest: {
          type: "object",
          required: ["userId", "batchId"],
          properties: {
            userId: {
              type: "string",
              example: "cmr123abc",
            },
            batchId: {
              type: "string",
              example: "cmr456def",
            },
            rollNumber: {
              type: "string",
              example: "23CS001",
            },
            semester: {
              type: "number",
              example: 1,
            },
          },
        },

        UpdateStudentRequest: {
          type: "object",
          properties: {
            batchId: {
              type: "string",
              example: "cmr456def",
            },
            rollNumber: {
              type: "string",
              example: "23CS010",
            },
            semester: {
              type: "number",
              example: 2,
            },
          },
        },
        CreateTeacherRequest: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: {
              type: "string",
              example: "cmr123abc",
            },
            designation: {
              type: "string",
              example: "Assistant Professor",
            },
            qualification: {
              type: "string",
              example: "PhD Computer Science",
            },
            experience: {
              type: "number",
              example: 8,
            },
          },
        },

        UpdateTeacherRequest: {
          type: "object",
          properties: {
            designation: {
              type: "string",
              example: "Associate Professor",
            },
            qualification: {
              type: "string",
              example: "PhD Artificial Intelligence",
            },
            experience: {
              type: "number",
              example: 10,
            },
          },
        },
        CreateCourseRequest: {
          type: "object",
          required: [
            "name",
            "code",
            "instituteId",
            "subjectId",
            "teacherId",
            "batchId",
          ],
          properties: {
            name: {
              type: "string",
              example: "Data Structures",
            },
            code: {
              type: "string",
              example: "CS201",
            },
            description: {
              type: "string",
              example: "Core CS Course",
            },
            instituteId: {
              type: "string",
            },
            subjectId: {
              type: "string",
            },
            teacherId: {
              type: "string",
            },
            batchId: {
              type: "string",
            },
            academicYear: {
              type: "string",
              example: "2026-27",
            },
            semester: {
              type: "integer",
              example: 3,
            },
            credits: {
              type: "integer",
              example: 4,
            },
          },
        },

        UpdateCourseRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            semester: {
              type: "integer",
            },
            credits: {
              type: "integer",
            },
            academicYear: {
              type: "string",
            },
          },
        },

        CreateExamRequest: {
          type: "object",
          required: [
            "title",
            "courseId",
            "startTime",
            "endTime",
            "durationMinutes",
            "totalMarks",
            "passingMarks",
          ],
          properties: {
            title: {
              type: "string",
              example: "Mid Semester Exam",
            },
            description: {
              type: "string",
            },
            instructions: {
              type: "string",
            },
            courseId: {
              type: "string",
            },
            startTime: {
              type: "string",
              format: "date-time",
            },
            endTime: {
              type: "string",
              format: "date-time",
            },
            durationMinutes: {
              type: "integer",
              example: 90,
            },
            totalMarks: {
              type: "integer",
              example: 100,
            },
            passingMarks: {
              type: "integer",
              example: 40,
            },
            negativeMarking: {
              type: "boolean",
            },
            shuffleQuestions: {
              type: "boolean",
            },
            shuffleOptions: {
              type: "boolean",
            },
            showResultImmediately: {
              type: "boolean",
            },
            maxAttempts: {
              type: "integer",
              example: 1,
            },
          },
        },

        UpdateExamRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            instructions: {
              type: "string",
            },
            startTime: {
              type: "string",
              format: "date-time",
            },
            endTime: {
              type: "string",
              format: "date-time",
            },
            durationMinutes: {
              type: "integer",
            },
            totalMarks: {
              type: "integer",
            },
            passingMarks: {
              type: "integer",
            },
            status: {
              type: "string",
              example: "DRAFT",
            },
            isPublished: {
              type: "boolean",
            },
          },
        },

        CreateQuestionRequest: {
          type: "object",
          required: ["title", "type"],
          properties: {
            title: {
              type: "string",
              example: "What is OOP?",
            },
            description: {
              type: "string",
            },
            type: {
              type: "string",
              example: "MCQ",
            },
            difficulty: {
              type: "string",
              example: "MEDIUM",
            },
            chapter: {
              type: "string",
            },
            topic: {
              type: "string",
            },
            explanation: {
              type: "string",
            },
            solution: {
              type: "string",
            },
            marks: {
              type: "integer",
            },
            negativeMarks: {
              type: "number",
            },
            estimatedTime: {
              type: "integer",
            },
            source: {
              type: "string",
            },
            year: {
              type: "integer",
            },
            language: {
              type: "string",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },

        UpdateQuestionRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            explanation: {
              type: "string",
            },
            solution: {
              type: "string",
            },
            difficulty: {
              type: "string",
            },
            marks: {
              type: "integer",
            },
            negativeMarks: {
              type: "number",
            },
          },
        },
        UpdateProcessingJobRequest: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "PROCESSING",
            },
            progress: {
              type: "integer",
              example: 50,
            },
            error: {
              type: "string",
              example: "OCR failed",
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.ts"],
});
