// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import compression from "compression";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";

// import { env } from "./config/env";

// import swaggerUi from "swagger-ui-express";
// import { swaggerSpec } from "./config/swagger";

// import { errorHandler } from "./common/middleware";
// import { authRoutes } from "./modules/auth/routes";
// import { userRoutes } from "./modules/users/routes";
// import { instituteRoutes } from "./modules/institutes/routes";
// import { subjectRoutes } from "./modules/subjects/routes";
// import { batchRoutes } from "./modules/batches/routes";
// import { studentRoutes } from "./modules/students/routes";
// import { teacherRoutes } from "./modules/teachers/routes";
// import { courseRoutes } from "./modules/courses/routes";
// import { examRoutes } from "./modules/exams/routes";
// import { questionRoutes } from "./modules/questions/routes";
// import { documentRoutes } from "./modules/documents/routes";
// import { processingJobRoutes } from "./modules/processing-jobs/routes";
// import { pdfProcessingRoutes } from "./modules/pdf-processing/routes";
// import { aiRoutes } from "./modules/ai/routes";
// import { aiReviewRoutes } from "./modules/ai-review/routes";
// import ocrRoutes from "./modules/ocr/routes/ocr.routes";

// import { examAttemptRoutes } from "./modules/exam-attempts";
// import { evaluationRoutes } from "./modules/evaluation";

// const app = express();

// app.use(
//   cors({
//     origin: env.CLIENT_URL,
//     credentials: true,
//   }),
// );

// app.use(helmet());
// app.use(compression());
// app.use(morgan("dev"));

// app.use(cookieParser());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/api/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "ExamVerse AI Backend Running 🚀",
//     timestamp: new Date().toISOString(),
//   });
// });

// console.log("Swagger JSON route registered");
// app.get("/api/docs-json", (_req, res) => {
//   res.json(swaggerSpec);
// });

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// */

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/institutes", instituteRoutes);
// app.use("/api/subjects", subjectRoutes);
// app.use("/api/batches", batchRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/exams", examRoutes);
// app.use("/api/questions", questionRoutes);
// app.use("/api/documents", documentRoutes);
// app.use("/api/processing-jobs", processingJobRoutes);
// app.use("/api/pdf-processing", pdfProcessingRoutes);
// app.use("/api/ai", aiRoutes);
// app.use("/api/ai-review", aiReviewRoutes);
// app.use("/api/ocr", ocrRoutes);
// app.use("/api/exam-attempts", examAttemptRoutes);
// app.use("/api/evaluation", evaluationRoutes);
// app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// /*
// |--------------------------------------------------------------------------
// | 404
// |--------------------------------------------------------------------------
// */

// app.use((_req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// /*
// |--------------------------------------------------------------------------
// | Global Error Handler
// |--------------------------------------------------------------------------
// */

// app.use(errorHandler);

// export default app;

import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import { errorHandler, authRateLimiter, aiRateLimiter } from "./common/middleware";
import { authRoutes } from "./modules/auth/routes";
import { userRoutes } from "./modules/users/routes";
import { instituteRoutes } from "./modules/institutes/routes";
import { subjectRoutes } from "./modules/subjects/routes";
import { batchRoutes } from "./modules/batches/routes";
import { studentRoutes } from "./modules/students/routes";
import { teacherRoutes } from "./modules/teachers/routes";
import { courseRoutes } from "./modules/courses/routes";
import { examRoutes } from "./modules/exams/routes";
import { questionRoutes } from "./modules/questions/routes";
import { documentRoutes } from "./modules/documents/routes";
import { processingJobRoutes } from "./modules/processing-jobs/routes";
import { pdfProcessingRoutes } from "./modules/pdf-processing/routes";
import { aiRoutes } from "./modules/ai/routes";
import { aiReviewRoutes } from "./modules/ai-review/routes";
import ocrRoutes from "./modules/ocr/routes/ocr.routes";

import { examAttemptRoutes } from "./modules/exam-attempts";
import { evaluationRoutes } from "./modules/evaluation";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(process.cwd(), "uploads")),
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ExamVerse AI Backend Running 🚀",
    timestamp: new Date().toISOString(),
  });
});

console.log("Swagger JSON route registered");
app.get("/api/docs-json", (_req, res) => {
  res.json(swaggerSpec);
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/processing-jobs", processingJobRoutes);
app.use("/api/pdf-processing", pdfProcessingRoutes);
app.use("/api/ai", aiRateLimiter, aiRoutes);
app.use("/api/ai-review", aiReviewRoutes);
app.use("/api/ocr", aiRateLimiter, ocrRoutes);
app.use("/api/exam-attempts", examAttemptRoutes);
app.use("/api/evaluation", evaluationRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;