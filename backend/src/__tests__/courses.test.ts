import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Course API", () => {
  let accessToken: string;

  let instituteId: string;
  let subjectId: string;
  let batchId: string;
  let teacherId: string;
  let courseId: string;

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

     });

     it("should create a course", async () => {
  const response = await request(app)
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

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  courseId = response.body.data.id;
});

it("should list courses", async () => {
  const response = await request(app)
    .get("/api/courses")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.courses).toBeInstanceOf(Array);

  expect(response.body.data.pagination).toBeDefined();
});

it("should get course by id", async () => {
  const response = await request(app)
    .get(`/api/courses/${courseId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.id).toBe(courseId);
});

it("should update a course", async () => {
  const response = await request(app)
    .patch(`/api/courses/${courseId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "Advanced Data Structures",
      credits: 5,
      semester: 4,
    });

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.name).toBe("Advanced Data Structures");

  expect(response.body.data.credits).toBe(5);
});

it("should soft delete a course", async () => {
  const response = await request(app)
    .delete(`/api/courses/${courseId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);
});

it("should return inactive course after delete", async () => {
  const response = await request(app)
    .get(`/api/courses/${courseId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.isActive).toBe(false);
});

it("should reject unauthorized request", async () => {
  const response = await request(app).get("/api/courses");

  expect(response.status).toBe(401);

  expect(response.body.success).toBe(false);
});

it("should reject invalid payload", async () => {
  const response = await request(app)
    .post("/api/courses")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({});

  expect(response.status).toBe(400);

  expect(response.body.success).toBe(false);
});

});