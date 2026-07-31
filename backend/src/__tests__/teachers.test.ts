import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Teacher API", () => {
  let accessToken: string;
  let teacherUserId: string;
  let teacherId: string;

  beforeAll(async () => {
    const email = `admin${Date.now()}@example.com`;

    const register = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email,
      password: "Password@123",
    });

    expect(register.status).toBe(201);

    await prisma.user.update({
      where: {
        email,
      },
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

    const teacherUser = await prisma.user.create({
      data: {
        name: "Teacher User",
        email: `teacher${Date.now()}@example.com`,
        passwordHash: "dummy",
        role: "TEACHER",
      },
    });

    teacherUserId = teacherUser.id;
  });

  it("should create a teacher", async () => {
  const response = await request(app)
    .post("/api/teachers")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      userId: teacherUserId,
      designation: "Assistant Professor",
      qualification: "M.Tech",
      experience: 5,
    });

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  teacherId = response.body.data.id;
});

it("should list teachers", async () => {
  const response = await request(app)
    .get("/api/teachers")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.teachers).toBeInstanceOf(Array);

  expect(response.body.data.pagination).toBeDefined();
});

it("should get teacher by id", async () => {
  const response = await request(app)
    .get(`/api/teachers/${teacherId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.id).toBe(teacherId);
});

it("should update teacher", async () => {
  const response = await request(app)
    .patch(`/api/teachers/${teacherId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      designation: "Associate Professor",
      qualification: "PhD Computer Science",
      experience: 10,
    });

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.designation).toBe("Associate Professor");
});

it("should delete teacher", async () => {
  const response = await request(app)
    .delete(`/api/teachers/${teacherId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);
});

it("should return 404 for deleted teacher", async () => {
  const response = await request(app)
    .get(`/api/teachers/${teacherId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(404);

  expect(response.body.success).toBe(false);
});

it("should reject unauthorized request", async () => {
  const response = await request(app).get("/api/teachers");

  expect(response.status).toBe(401);

  expect(response.body.success).toBe(false);
});

  it("should reject invalid payload", async () => {
    const response = await request(app)
      .post("/api/teachers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

  it("should convert registered student role to TEACHER when creating teacher profile", async () => {
    const studentUser = await prisma.user.create({
      data: {
        name: "Registered Student",
        email: `student_to_teacher_${Date.now()}@example.com`,
        passwordHash: "dummy",
        role: "STUDENT",
      },
    });

    const response = await request(app)
      .post("/api/teachers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        userId: studentUser.id,
        designation: "Lecturer",
        qualification: "M.Sc",
        experience: 2,
      });

    expect(response.status).toBe(201);

    const updatedUser = await prisma.user.findUnique({
      where: { id: studentUser.id },
    });
    expect(updatedUser?.role).toBe("TEACHER");

    // Delete teacher profile and verify user role reverts to STUDENT
    const teacherIdToDelete = response.body.data.id;
    const deleteRes = await request(app)
      .delete(`/api/teachers/${teacherIdToDelete}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(deleteRes.status).toBe(200);

    const revertedUser = await prisma.user.findUnique({
      where: { id: studentUser.id },
    });
    expect(revertedUser?.role).toBe("STUDENT");
  });
});