import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

describe("Batch API", () => {
  let accessToken: string;
  let instituteId: string;
  let batchId: string;

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
      data: { role: "ADMIN" },
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
  });

  it("should create a batch", async () => {
    const response = await request(app)
      .post("/api/batches")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "B.Tech CSE 2026",
        code: `CSE-${Date.now()}`,
        instituteId,
        academicYear: "2026-2027",
        semester: 1,
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    batchId = response.body.data.id;
  });

  it("should list batches", async () => {
    const response = await request(app)
      .get("/api/batches")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.batches).toBeInstanceOf(Array);

    expect(response.body.data.pagination).toBeDefined();
  });

  it("should get batch by id", async () => {
    const response = await request(app)
      .get(`/api/batches/${batchId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBe(batchId);
  });

  it("should update a batch", async () => {
    const response = await request(app)
      .patch(`/api/batches/${batchId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "B.Tech CSE Updated",
        semester: 2,
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name).toBe("B.Tech CSE Updated");

    expect(response.body.data.semester).toBe(2);
  });

  it("should soft delete a batch", async () => {
    const response = await request(app)
      .delete(`/api/batches/${batchId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should mark batch as inactive after deletion", async () => {
    const response = await request(app)
      .get(`/api/batches/${batchId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.isActive).toBe(false);
  });

  it("should reject unauthorized request", async () => {
    const response = await request(app).get("/api/batches");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject invalid batch payload", async () => {
    const response = await request(app)
      .post("/api/batches")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "",
        instituteId: "",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });
});
