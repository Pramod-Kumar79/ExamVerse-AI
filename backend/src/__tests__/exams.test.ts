import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Exam API", () => {
  let accessToken: string;

  let instituteId: string;
  let subjectId: string;
  let batchId: string;
  let teacherId: string;
  let courseId: string;
  let examId: string;

  beforeAll(async () => {
    const email = `admin${Date.now()}@example.com`;

    const register = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email,
      password: "Password@123",
    });

    expect(register.status).toBe(201);

    await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
      },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Password@123",
    });

    expect(login.status).toBe(200);

    accessToken = login.body.data.accessToken;

        const institute = await request(app)
      .post("/api/institutes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "IIT Kharagpur",
        code: `IIT-${Date.now()}`,
      });

    expect(institute.status).toBe(201);

    instituteId = institute.body.data.id;

        const subject = await request(app)
      .post("/api/subjects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Computer Science",
        code: `CS-${Date.now()}`,
      });

    expect(subject.status).toBe(201);

    subjectId = subject.body.data.id;

        const batch = await request(app)
      .post("/api/batches")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "B.Tech CSE",
        code: `BT-${Date.now()}`,
        instituteId,
        academicYear: "2026-27",
        semester: 3,
      });

    expect(batch.status).toBe(201);

    batchId = batch.body.data.id;

        const teacherUser = await prisma.user.create({
      data: {
        name: "Teacher",
        email: `teacher${Date.now()}@example.com`,
        passwordHash: "dummy",
        role: "TEACHER",
      },
    });

    const teacher = await request(app)
      .post("/api/teachers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: teacherUser.id,
        designation: "Professor",
        qualification: "PhD",
        experience: 10,
      });

    expect(teacher.status).toBe(201);

    teacherId = teacher.body.data.id;

        const course = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Data Structures",
        code: `CS201-${Date.now()}`,
        instituteId,
        subjectId,
        teacherId,
        batchId,
        academicYear: "2026-27",
        semester: 3,
        credits: 4,
      });

    expect(course.status).toBe(201);

    courseId = course.body.data.id;
  });

  it("should create an exam", async () => {
  const startTime = new Date(Date.now() + 60 * 60 * 1000);

  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

  const response = await request(app)
    .post("/api/exams")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: "Mid Semester Examination",
      description: "Internal Assessment",
      instructions: "Answer all questions.",
      courseId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes: 90,
      totalMarks: 100,
      passingMarks: 40,
      negativeMarking: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      showResultImmediately: false,
      maxAttempts: 1,
    });

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  examId = response.body.data.id;
 });

 it("should list exams", async () => {
   const response = await request(app)
     .get("/api/exams")
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.exams).toBeInstanceOf(Array);

   expect(response.body.data.pagination).toBeDefined();
 });

 it("should get exam by id", async () => {
   const response = await request(app)
     .get(`/api/exams/${examId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.id).toBe(examId);
 });

 it("should update an exam", async () => {
   const response = await request(app)
     .patch(`/api/exams/${examId}`)
     .set("Authorization", `Bearer ${accessToken}`)
     .send({
       title: "Updated Mid Semester Exam",
       totalMarks: 120,
       passingMarks: 50,
     });

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.title).toBe("Updated Mid Semester Exam");
 });

 it("should archive an exam", async () => {
   const response = await request(app)
     .delete(`/api/exams/${examId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);
 });

 it("should return archived exam", async () => {
   const response = await request(app)
     .get(`/api/exams/${examId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.status).toBe("ARCHIVED");

   expect(response.body.data.isPublished).toBe(false);
 });

 it("should reject invalid exam time", async () => {
   const start = new Date();

   const end = new Date(start.getTime() - 60000);

   const response = await request(app)
     .post("/api/exams")
     .set("Authorization", `Bearer ${accessToken}`)
     .send({
       title: "Invalid Exam",
       courseId,
       startTime: start.toISOString(),
       endTime: end.toISOString(),
       durationMinutes: 30,
       totalMarks: 100,
       passingMarks: 40,
     });

   expect(response.status).toBe(400);

   expect(response.body.success).toBe(false);
 });

 it("should reject invalid passing marks", async () => {
   const start = new Date(Date.now() + 3600000);

   const end = new Date(start.getTime() + 7200000);

   const response = await request(app)
     .post("/api/exams")
     .set("Authorization", `Bearer ${accessToken}`)
     .send({
       title: "Invalid Passing",
       courseId,
       startTime: start.toISOString(),
       endTime: end.toISOString(),
       durationMinutes: 60,
       totalMarks: 50,
       passingMarks: 80,
     });

   expect(response.status).toBe(400);

   expect(response.body.success).toBe(false);
 });

 it("should reject duration exceeding exam window", async () => {
   const start = new Date(Date.now() + 3600000);

   const end = new Date(start.getTime() + 3600000);

   const response = await request(app)
     .post("/api/exams")
     .set("Authorization", `Bearer ${accessToken}`)
     .send({
       title: "Too Long",
       courseId,
       startTime: start.toISOString(),
       endTime: end.toISOString(),
       durationMinutes: 180,
       totalMarks: 100,
       passingMarks: 40,
     });

   expect(response.status).toBe(400);

   expect(response.body.success).toBe(false);
 });

  it("should reject unauthorized request", async () => {
    const response = await request(app).get("/api/exams");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should isolate exams between different teachers", async () => {
    // 1. Create Teacher A user & login
    const emailA = `exam_teacher_a_${Date.now()}@example.com`;
    const regA = await request(app).post("/api/auth/register").send({
      name: "Exam Teacher A",
      email: emailA,
      password: "Password@123",
    });
    const userIdA = regA.body.data.user.id;
    await prisma.user.update({ where: { id: userIdA }, data: { role: "TEACHER" } });
    const loginA = await request(app).post("/api/auth/login").send({ email: emailA, password: "Password@123" });
    const tokenA = loginA.body.data.accessToken;

    // 2. Create Teacher B user & login
    const emailB = `exam_teacher_b_${Date.now()}@example.com`;
    const regB = await request(app).post("/api/auth/register").send({
      name: "Exam Teacher B",
      email: emailB,
      password: "Password@123",
    });
    const userIdB = regB.body.data.user.id;
    await prisma.user.update({ where: { id: userIdB }, data: { role: "TEACHER" } });
    const loginB = await request(app).post("/api/auth/login").send({ email: emailB, password: "Password@123" });
    const tokenB = loginB.body.data.accessToken;

    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 7200000);

    // 3. Teacher A creates Exam A
    const resA = await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        title: "Exam by Teacher A",
        courseId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        durationMinutes: 60,
        totalMarks: 50,
        passingMarks: 20,
      });
    expect(resA.status).toBe(201);
    const examAId = resA.body.data.id;

    // 4. Teacher B creates Exam B
    const resB = await request(app)
      .post("/api/exams")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "Exam by Teacher B",
        courseId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        durationMinutes: 60,
        totalMarks: 50,
        passingMarks: 20,
      });
    expect(resB.status).toBe(201);
    const examBId = resB.body.data.id;

    // 5. Teacher A lists exams -> sees examAId, not examBId
    const listA = await request(app).get("/api/exams").set("Authorization", `Bearer ${tokenA}`);
    const idsA = listA.body.data.exams.map((e: any) => e.id);
    expect(idsA).toContain(examAId);
    expect(idsA).not.toContain(examBId);

    // 6. Teacher B lists exams -> sees examBId, not examAId
    const listB = await request(app).get("/api/exams").set("Authorization", `Bearer ${tokenB}`);
    const idsB = listB.body.data.exams.map((e: any) => e.id);
    expect(idsB).toContain(examBId);
    expect(idsB).not.toContain(examAId);

    // 7. Teacher A tries to view Exam B -> 403 Forbidden
    const forbiddenRes = await request(app)
      .get(`/api/exams/${examBId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(forbiddenRes.status).toBe(403);
  });
});