import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Question API", () => {
  let accessToken: string;
  let questionId: string;

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
  });

  it("should create a question", async () => {
  const response = await request(app)
    .post("/api/questions")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: "What is Object Oriented Programming?",
      description: "Basic OOP question",
      type: "MCQ",
      difficulty: "MEDIUM",
      explanation: "Tests OOP fundamentals",
      marks: 4,
      negativeMarks: 1,
      tags: ["OOP", "Programming"],
    });

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  questionId = response.body.data.id;
});

it("should list questions", async () => {
  const response = await request(app)
    .get("/api/questions")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.questions).toBeInstanceOf(Array);

  expect(response.body.data.pagination).toBeDefined();
});

it("should get question by id", async () => {
  const response = await request(app)
    .get(`/api/questions/${questionId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.id).toBe(questionId);
});

it("should update a question", async () => {
  const response = await request(app)
    .patch(`/api/questions/${questionId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: "Updated OOP Question",
      marks: 5,
      explanation: "Updated explanation",
    });

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.title).toBe("Updated OOP Question");
});

it("should soft delete a question", async () => {
  const response = await request(app)
    .delete(`/api/questions/${questionId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);
});

it("should return inactive question after delete", async () => {
  const response = await request(app)
    .get(`/api/questions/${questionId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.isActive).toBe(false);
});

it("should reject MCQ without explanation", async () => {
  const response = await request(app)
    .post("/api/questions")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: "Invalid MCQ",
      type: "MCQ",
    });

  expect(response.status).toBe(400);

  expect(response.body.success).toBe(false);
});

  it("should reject unauthorized request", async () => {
    const response = await request(app).get("/api/questions");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should isolate question banks between different teachers", async () => {
    // 1. Create Teacher A & login
    const emailA = `teachera_${Date.now()}@example.com`;
    const regA = await request(app).post("/api/auth/register").send({
      name: "Teacher A",
      email: emailA,
      password: "Password@123",
    });
    const userIdA = regA.body.data.user.id;
    await prisma.user.update({ where: { id: userIdA }, data: { role: "TEACHER" } });
    const loginA = await request(app).post("/api/auth/login").send({ email: emailA, password: "Password@123" });
    const tokenA = loginA.body.data.accessToken;

    // 2. Create Teacher B & login
    const emailB = `teacherb_${Date.now()}@example.com`;
    const regB = await request(app).post("/api/auth/register").send({
      name: "Teacher B",
      email: emailB,
      password: "Password@123",
    });
    const userIdB = regB.body.data.user.id;
    await prisma.user.update({ where: { id: userIdB }, data: { role: "TEACHER" } });
    const loginB = await request(app).post("/api/auth/login").send({ email: emailB, password: "Password@123" });
    const tokenB = loginB.body.data.accessToken;

    // 3. Teacher A creates question QA
    const qA = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Question by Teacher A", type: "SHORT_ANSWER" });
    expect(qA.status).toBe(201);
    const qAId = qA.body.data.id;

    // 4. Teacher B creates question QB
    const qB = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Question by Teacher B", type: "SHORT_ANSWER" });
    expect(qB.status).toBe(201);
    const qBId = qB.body.data.id;

    // 5. Teacher A lists questions -> sees qAId, not qBId
    const listA = await request(app).get("/api/questions").set("Authorization", `Bearer ${tokenA}`);
    const idsA = listA.body.data.questions.map((q: any) => q.id);
    expect(idsA).toContain(qAId);
    expect(idsA).not.toContain(qBId);

    // 6. Teacher B lists questions -> sees qBId, not qAId
    const listB = await request(app).get("/api/questions").set("Authorization", `Bearer ${tokenB}`);
    const idsB = listB.body.data.questions.map((q: any) => q.id);
    expect(idsB).toContain(qBId);
    expect(idsB).not.toContain(qAId);

    // 7. Teacher A tries to view Teacher B's question -> 403 Forbidden
    const forbiddenRes = await request(app)
      .get(`/api/questions/${qBId}`)
      .set("Authorization", `Bearer ${tokenA}`);
    expect(forbiddenRes.status).toBe(403);
  });
});