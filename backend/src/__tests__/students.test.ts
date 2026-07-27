import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

describe("Student API", () => {
  let accessToken: string;

  let instituteId: string;
  let batchId: string;
  let studentUserId: string;
  let studentId: string;

  beforeAll(async () => {
    const adminEmail = `admin${Date.now()}@example.com`;

    const register = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: adminEmail,
      password: "Password@123",
    });

    expect(register.status).toBe(201);

    await prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        role: "ADMIN",
      },
    });

    const login = await request(app).post("/api/auth/login").send({
      email: adminEmail,
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

        const batch = await request(app)
      .post("/api/batches")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "B.Tech CSE",
        code: `CSE-${Date.now()}`,
        instituteId,
        academicYear: "2026-2027",
        semester: 1,
      });

    expect(batch.status).toBe(201);

    batchId = batch.body.data.id;

        const studentUser = await prisma.user.create({
      data: {
        name: "Student One",
        email: `student${Date.now()}@example.com`,
        passwordHash: "dummy",
        role: "STUDENT",
      },
    });

    studentUserId = studentUser.id;
  });

  it("should create a student", async () => {
  const response = await request(app)
    .post("/api/students")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      userId: studentUserId,
      batchId,
      rollNumber: `23CS${Date.now()}`,
      semester: 1,
    });

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  studentId = response.body.data.id;
 });

 it("should list students", async () => {
   const response = await request(app)
     .get("/api/students")
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.students).toBeInstanceOf(Array);

   expect(response.body.data.pagination).toBeDefined();
 });

 it("should get student by id", async () => {
   const response = await request(app)
     .get(`/api/students/${studentId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.id).toBe(studentId);
 });

 it("should update a student", async () => {
   const response = await request(app)
     .patch(`/api/students/${studentId}`)
     .set("Authorization", `Bearer ${accessToken}`)
     .send({
       semester: 2,
       rollNumber: `24CS${Date.now()}`,
     });

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);

   expect(response.body.data.semester).toBe(2);
 });

 it("should delete a student", async () => {
   const response = await request(app)
     .delete(`/api/students/${studentId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(200);

   expect(response.body.success).toBe(true);
 });

 it("should return 404 for deleted student", async () => {
   const response = await request(app)
     .get(`/api/students/${studentId}`)
     .set("Authorization", `Bearer ${accessToken}`);

   expect(response.status).toBe(404);

   expect(response.body.success).toBe(false);
 });

 it("should reject unauthorized request", async () => {
   const response = await request(app).get("/api/students");

   expect(response.status).toBe(401);

   expect(response.body.success).toBe(false);
 });

 it("should reject invalid payload", async () => {
   const response = await request(app)
     .post("/api/students")
     .set("Authorization", `Bearer ${accessToken}`)
     .send({});

   expect(response.status).toBe(400);

   expect(response.body.success).toBe(false);
 });

});