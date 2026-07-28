<![CDATA[<div align="center">

# 🧭 ExamVerse AI

### Smarter Exams, Powered by AI

**Build, manage, and take exams — faster, with AI on your side.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%7C%206.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [AI Pipeline](#-ai-pipeline)
- [User Roles & Permissions](#-user-roles--permissions)
- [Testing](#-testing)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔴 The Problem

Creating, managing, and conducting examinations in educational institutions is a **tedious, error-prone, and time-consuming process** that has remained largely unchanged for decades:

### For Teachers & Institutions
- **Question paper creation is manual and repetitive.** Educators spend hours sifting through textbooks, past papers, and notes to compile questions — often retyping or reformatting them by hand.
- **Digitizing legacy question papers is painful.** Decades of valuable past examination papers exist only as scanned PDFs or photocopies. Converting these into usable, searchable, structured question banks requires manual data entry.
- **No centralized question bank.** Questions live in scattered Word documents, PDFs, and personal notes. There's no way to tag, search, filter, or reuse them across semesters and courses.
- **Exam logistics are cumbersome.** Scheduling exams, enforcing time limits, shuffling questions to prevent cheating, managing multiple batches — all require significant administrative overhead.
- **Grading is slow and inconsistent.** Manual evaluation introduces delays and subjectivity, especially for large batches of students.

### For Students
- **Limited access to practice material.** Students struggle to find well-organized past papers or practice exams for self-study.
- **No consistent exam-taking experience.** Paper-based or ad-hoc online exams lack features like timers, auto-submission, and immediate feedback.
- **Results take too long.** Waiting days or weeks for graded results disrupts the learning feedback loop.

### The Core Gap
There is **no affordable, unified platform** that bridges document processing, AI-powered question extraction, structured question banking, online exam delivery, and automated evaluation — all tailored for the academic workflow of institutes, teachers, and students.

---

## 🟢 The Solution

**ExamVerse AI** is a full-stack, AI-powered examination management platform that automates the entire exam lifecycle — from question paper digitization to exam delivery and evaluation.

### How It Works

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Upload PDF /   │────▶│  PDF Text    │────▶│  AI Question     │────▶│  Review &    │
│  Scanned Paper  │     │  Extraction  │     │  Extraction      │     │  Approve     │
│                 │     │  + OCR       │     │  (Gemini 2.5)    │     │  Questions   │
└─────────────────┘     └──────────────┘     └──────────────────┘     └──────┬───────┘
                                                                             │
                    ┌────────────────────────────────────────────────────────┘
                    ▼
┌──────────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Structured      │────▶│  Assemble    │────▶│  Students Take   │────▶│  Auto-       │
│  Question Bank   │     │  Exams       │     │  Exam Online     │     │  Evaluate    │
│  (tagged, rich)  │     │  (timed)     │     │  (any device)    │     │  & Score     │
└──────────────────┘     └──────────────┘     └──────────────────┘     └──────────────┘
```

Teachers upload a question paper PDF → ExamVerse extracts the text (with OCR fallback for scanned documents) → Google Gemini AI parses and structures every question with metadata (subject, chapter, difficulty, Bloom's level, options, correct answers, LaTeX math) → Teachers review, edit, and approve the extracted questions → Approved questions feed into a searchable question bank → Teachers assemble timed exams from the bank → Students take exams on any device with shuffled questions, auto-submit, and real-time timers → The system auto-evaluates objective questions and scores attempts instantly.

---

## ✨ Key Features

### 🤖 AI-Powered Question Extraction
- Upload PDF question papers (native text or scanned images)
- Automatic text extraction with **unpdf**; OCR fallback via **Tesseract.js** for scanned documents
- **Google Gemini 2.5 Flash** extracts structured questions with metadata: type, difficulty, Bloom's level, options, correct answers, explanations, and LaTeX-rendered math
- Confidence scoring for each extracted question
- Human-in-the-loop review workflow: approve, reject, or edit AI-extracted questions before publishing

### 🏛️ Multi-Institute Management
- Create and manage multiple institutes from a single deployment
- Organize students into **batches** (e.g., "B.Tech CSE 2026")
- Define **subjects** and **courses** linked to institutes, batches, and teachers
- Role-based access: **Admin**, **Institute**, **Teacher**, **Student**

### 🧠 Smart Question Bank
- Rich question types: **MCQ**, **Multiple Select**, **True/False**, **Numerical**, **Short Answer**, **Long Answer**, **Coding**
- Tag questions by chapter, topic, difficulty (**Easy / Medium / Hard**), and Bloom's taxonomy level (**Remember → Create**)
- Support for images, LaTeX math rendering (via **KaTeX**), and code snippets
- Track question source, year, estimated time, and language
- Mark questions as AI-generated for provenance tracking

### ⏱️ Timed, Fair Online Exams
- Schedule exams with precise start/end times and duration limits
- Shuffle questions and options per student to prevent cheating
- Negative marking support
- Auto-submission when time expires
- Configurable max attempts and immediate result display
- **Practice exam mode** for student self-study (not tied to any course)

### 📊 Automated Evaluation & Results
- Auto-grading for MCQ, True/False, and Numerical question types
- Numerical answers graded with configurable tolerance (±0.01)
- Subjective questions (Short Answer, Long Answer, Coding) left for manual teacher review
- Instant score calculation and attempt tracking
- View detailed results: per-question marks, total score, pass/fail status

### 🔐 Secure Authentication
- JWT-based authentication with short-lived access tokens and long-lived refresh tokens (stored as HTTP-only cookies)
- Bcrypt password hashing
- Automatic token refresh with retry logic on the frontend
- Role-based route protection on both frontend and backend

### 📱 Responsive, Modern UI
- Built with **Next.js 16** and **React 19** using the App Router
- **Tailwind CSS 4** for rapid, responsive styling
- Dark mode support out of the box
- Works on desktop, tablet, and mobile
- Reusable component library: `Button`, `Modal`, `Field`, `Card`, `Spinner`, `Alert`, `MathText`
- Generic **ResourceManager** component for CRUD management of any entity

### 📖 API Documentation
- Interactive **Swagger UI** at `/api/docs`
- OpenAPI 3.0.3 spec with full schema definitions
- JSON spec available at `/api/docs-json`

---

## 🏗️ Architecture Overview

ExamVerse AI follows a **monorepo structure** with cleanly separated frontend and backend applications:

```
ExamVerse-AI/
├── backend/          # Express 5 REST API (TypeScript)
│   ├── src/
│   │   ├── modules/  # Feature modules (18 domains)
│   │   ├── common/   # Shared types, errors, middleware
│   │   ├── config/   # Environment, Swagger, PDF config
│   │   ├── lib/      # Prisma client, JWT, bcrypt, logger
│   │   └── utils/    # ApiError, ApiResponse, asyncHandler
│   ├── prisma/       # Schema + migrations
│   └── tests/        # Jest test suite
│
└── frontend/         # Next.js 16 App (TypeScript)
    └── src/
        ├── app/      # Pages (App Router)
        ├── components/ # Reusable UI components
        └── lib/      # API client, auth context, types
```

### Backend Architecture

The backend uses a **modular, layered architecture** where each feature domain is self-contained:

```
Module (e.g., "ai", "exams", "questions")
├── controllers/    # Request handling & response formatting
├── services/       # Business logic (interface + implementation)
├── repositories/   # Database access via Prisma
├── routes/         # Express route definitions
├── schemas/        # Zod validation schemas
├── dto/            # Data Transfer Objects
├── middleware/     # Module-specific middleware
└── index.ts        # Public barrel exports
```

This separation ensures:
- **Testability**: Services depend on interfaces, enabling easy mocking
- **Maintainability**: Each module can evolve independently
- **Clarity**: Clear boundaries between HTTP handling, business logic, and data access

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express 5** | HTTP framework |
| **TypeScript 6** | Type-safe development |
| **Prisma 7** | ORM & database migrations |
| **PostgreSQL (Neon)** | Cloud-native relational database |
| **Google Gemini 2.5 Flash** | AI question extraction |
| **Tesseract.js 7** | OCR for scanned PDFs |
| **unpdf** | Native PDF text extraction |
| **Jose / jsonwebtoken** | JWT authentication |
| **Bcrypt** | Password hashing |
| **Zod 4** | Runtime schema validation |
| **Swagger (OpenAPI 3.0)** | API documentation |
| **Pino** | Structured logging |
| **Helmet** | HTTP security headers |
| **Morgan** | Request logging |
| **Multer** | File upload handling |
| **Jest** | Unit & integration testing |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **KaTeX** | LaTeX math rendering |
| **React Compiler** | Automatic memoization |

---

## 📁 Project Structure

### Backend Modules (18 Domains)

| Module | Description |
|---|---|
| `auth` | Registration, login, logout, JWT refresh, password management |
| `users` | User profile CRUD, current user (`/me`) |
| `institutes` | Institute creation and management |
| `batches` | Student batch management (year, semester, date ranges) |
| `subjects` | Subject catalog management |
| `courses` | Course creation linking institute → subject → teacher → batch |
| `teachers` | Teacher profile management (designation, qualification, experience) |
| `students` | Student profile management (roll number, semester, batch) |
| `exams` | Exam creation, scheduling, configuration, publishing |
| `questions` | Question bank CRUD with rich metadata and options |
| `documents` | PDF/document upload with storage management |
| `pdf-processing` | PDF text extraction and page-level analysis |
| `ocr` | Tesseract.js-based OCR for scanned documents |
| `ai` | Gemini AI integration, prompt engineering, JSON parsing, validation |
| `ai-review` | Human-in-the-loop review queue for AI-extracted questions |
| `processing-jobs` | Background job tracking for document processing pipelines |
| `exam-attempts` | Student exam session management (start, submit, auto-submit) |
| `evaluation` | Automated grading engine for objective question types |

### Frontend Pages

| Route | Description |
|---|---|
| `/` | Landing page with feature showcase |
| `/login` | User authentication |
| `/register` | New account creation |
| `/dashboard` | Role-aware dashboard |
| `/institutes` | Institute management (Admin) |
| `/batches` | Batch management |
| `/subjects` | Subject catalog |
| `/courses` | Course management |
| `/teachers` | Teacher profiles |
| `/students` | Student profiles |
| `/questions` | Question bank with filtering |
| `/exams` | Exam listing and creation |
| `/exams/new` | Exam creation wizard |
| `/exams/[id]` | Exam detail — manage questions, view attempts |
| `/exams/[id]/take` | Student exam-taking interface with timer |
| `/exams/[id]/results` | Detailed attempt results |
| `/documents` | Document upload and AI processing pipeline |
| `/documents/[id]` | Document detail — OCR, AI extraction, review queue |
| `/practice` | Student practice exam creation |
| `/results` | Results overview |
| `/profile` | User profile management |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **PostgreSQL** database (recommended: [Neon](https://neon.tech/) for serverless Postgres)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ExamVerse-AI.git
cd ExamVerse-AI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual values (see Environment Variables section)

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

The backend will start at `http://localhost:5001`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:3000`.

### 4. Verify

- **Backend health**: `GET http://localhost:5001/api/health`
- **API docs**: `http://localhost:5001/api/docs`
- **Frontend**: `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5001` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `JWT_ACCESS_SECRET` | JWT signing secret (≥ 32 chars) | `your-super-secret-access-key...` |
| `JWT_REFRESH_SECRET` | Refresh token secret (≥ 32 chars) | `your-super-secret-refresh-key...` |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `30m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `CLIENT_URL` | Frontend origin (for CORS) | `http://localhost:3000` |

> **Note:** Environment variables are validated at startup using Zod. The server will refuse to start if any required variable is missing or malformed.

---

## 📡 API Reference

The API follows RESTful conventions under the `/api` prefix. All endpoints return responses in the format:

```json
{
  "success": true,
  "message": "Description of the result",
  "data": { ... }
}
```

### Route Groups

| Prefix | Description | Auth Required |
|---|---|---|
| `/api/auth` | Register, login, logout, token refresh | Partial |
| `/api/users` | User profiles, current user | ✅ |
| `/api/institutes` | Institute CRUD | ✅ |
| `/api/subjects` | Subject catalog CRUD | ✅ |
| `/api/batches` | Batch CRUD | ✅ |
| `/api/students` | Student profile CRUD | ✅ |
| `/api/teachers` | Teacher profile CRUD | ✅ |
| `/api/courses` | Course CRUD | ✅ |
| `/api/exams` | Exam lifecycle management | ✅ |
| `/api/questions` | Question bank management | ✅ |
| `/api/documents` | Document upload & management | ✅ |
| `/api/pdf-processing` | PDF text analysis | ✅ |
| `/api/ocr` | OCR text extraction | ✅ |
| `/api/ai` | AI question extraction | ✅ |
| `/api/ai-review` | AI question review queue | ✅ |
| `/api/processing-jobs` | Processing job tracking | ✅ |
| `/api/exam-attempts` | Exam attempt lifecycle | ✅ |
| `/api/evaluation` | Auto-evaluation trigger | ✅ |

### Interactive Documentation

Full interactive API documentation with request/response schemas is available at:

```
http://localhost:5001/api/docs
```

---

## 🗃️ Database Schema

The database uses **PostgreSQL** with **Prisma ORM** and includes the following core models:

```mermaid
erDiagram
    User ||--o| StudentProfile : has
    User ||--o| TeacherProfile : has
    User }o--o| Institute : "belongs to"
    User ||--o{ RefreshToken : has
    User ||--o{ UploadedDocument : uploads
    User ||--o{ Question : creates
    User ||--o{ Exam : creates

    Institute ||--o{ Batch : has
    Institute ||--o{ Course : has

    Batch ||--o{ StudentProfile : contains
    Batch ||--o{ Course : has

    Subject ||--o{ Course : "taught as"

    TeacherProfile ||--o{ Course : teaches

    Course ||--o{ Exam : has

    Exam ||--o{ ExamQuestion : contains
    Exam ||--o{ ExamAttempt : has

    Question ||--o{ QuestionOption : has
    Question ||--o{ ExamQuestion : "used in"
    Question ||--o{ StudentAnswer : "answered in"
    Question ||--o{ AIExtractedQuestion : "extracted as"

    ExamAttempt ||--o{ StudentAnswer : contains
    StudentProfile ||--o{ ExamAttempt : takes

    UploadedDocument ||--o{ ProcessingJob : "processed by"
    UploadedDocument ||--o{ AIExtractedQuestion : "source of"

    ProcessingJob ||--o{ AIExtractedQuestion : produces

    AIExtractedQuestion ||--o{ AIExtractedQuestionOption : has
```

### Key Enums

| Enum | Values |
|---|---|
| `UserRole` | `STUDENT`, `TEACHER`, `INSTITUTE`, `ADMIN` |
| `QuestionType` | `MCQ`, `MULTIPLE_SELECT`, `TRUE_FALSE`, `NUMERICAL`, `SHORT_ANSWER`, `LONG_ANSWER`, `CODING` |
| `DifficultyLevel` | `EASY`, `MEDIUM`, `HARD` |
| `BloomLevel` | `REMEMBER`, `UNDERSTAND`, `APPLY`, `ANALYZE`, `EVALUATE`, `CREATE` |
| `ExamStatus` | `DRAFT`, `SCHEDULED`, `LIVE`, `COMPLETED`, `ARCHIVED` |
| `DocumentStatus` | `UPLOADED`, `READY_FOR_PROCESSING`, `QUEUED`, `OCR_RUNNING`, `AI_RUNNING`, `REVIEW_PENDING`, `APPROVED`, `FAILED`, `ARCHIVED` |
| `AttemptStatus` | `IN_PROGRESS`, `SUBMITTED`, `AUTO_SUBMITTED`, `EVALUATED` |
| `AIReviewStatus` | `PENDING`, `APPROVED`, `REJECTED` |

---

## 🤖 AI Pipeline

The AI-powered question extraction pipeline is the core differentiator of ExamVerse AI:

```
                    ┌─────────────┐
                    │  Upload PDF │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  unpdf      │──── Native text extraction
                    │  Analysis   │     (page-by-page)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐     ┌───────────────┐
                    │  Has text?  │─No─▶│  Tesseract.js │
                    │             │     │  OCR Engine   │
                    └──────┬──────┘     └───────┬───────┘
                      Yes  │                    │
                           ├────────────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  Build Extraction   │
                    │  Prompt             │
                    │  (structured rules, │
                    │   LaTeX, schema)    │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  Google Gemini      │
                    │  2.5 Flash          │
                    │  (with 3x retry)   │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  JSON Response      │
                    │  Parser             │
                    │  (strip markdown,   │
                    │   extract JSON)     │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  Zod Validator      │
                    │  (schema check)     │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  AI Review Queue    │
                    │  (PENDING status)   │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  Teacher Review     │
                    │  Approve / Reject / │
                    │  Edit               │
                    └──────┬──────────────┘
                           │
                    ┌──────▼──────────────┐
                    │  Published to       │
                    │  Question Bank      │
                    └─────────────────────┘
```

### Prompt Engineering

The extraction prompt instructs Gemini to:
1. Return **only valid JSON** (no markdown, no explanation)
2. Preserve question numbering, equations, and mathematical symbols **exactly**
3. Wrap all math expressions in **LaTeX delimiters** (`$...$` inline, `$$...$$` display)
4. Infer metadata: subject, chapter, topic, difficulty
5. Include confidence scores (0.0–1.0) per question
6. Support 7 question types with proper option handling

### Resilience
- **3x retry** with 2-second backoff for transient Gemini errors (503, 429)
- JSON response sanitization (strips markdown code fences)
- Graceful error handling with detailed logging via Pino

---

## 👥 User Roles & Permissions

| Role | Capabilities |
|---|---|
| **Admin** | Full system access. Manage institutes, promote users, system configuration. |
| **Institute** | Manage batches, courses, teachers, and students within their institute. |
| **Teacher** | Upload documents, extract questions via AI, manage question banks, create & publish exams, review AI-extracted questions, view student results. |
| **Student** | Take assigned exams, create practice exams, view results and scores, upload documents for personal use. |

---

## 🧪 Testing

The backend includes a **Jest** test suite with ts-jest for TypeScript support:

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test configuration:
- **Test runner**: Jest 30
- **Transform**: ts-jest
- **Test location**: `src/__tests__/`
- **Coverage**: Collected from `src/**/*.ts` (excluding `server.ts`)

---

## 📜 Scripts

### Backend (`/backend`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `ts-node-dev --respawn --transpile-only src/server.ts` | Start dev server with hot reload |
| `npm run build` | `tsc` | Compile TypeScript to JavaScript |
| `npm start` | `node dist/server.js` | Start production server |
| `npm test` | `jest` | Run test suite |
| `npm run test:watch` | `jest --watch` | Run tests in watch mode |
| `npm run test:coverage` | `jest --coverage` | Run tests with coverage |

### Frontend (`/frontend`)

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Start Next.js dev server |
| `npm run build` | `next build` | Create production build |
| `npm start` | `next start` | Start production server |
| `npm run lint` | `eslint` | Lint the codebase |

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing **modular architecture** for new backend features (controller → service → repository)
- Use **Zod schemas** for all request validation
- Write **interfaces** for services and repositories to maintain testability
- Use **Prisma migrations** for all database changes (`npx prisma migrate dev`)
- Ensure the frontend is **responsive** and supports **dark mode**
- Render math expressions using the `MathText` component (KaTeX)

---

## 📄 License

ISC

---

<div align="center">

**Built with ❤️ for educators and students everywhere.**

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
]]>
