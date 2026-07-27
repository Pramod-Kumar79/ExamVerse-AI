import path from "path";

import request from "supertest";

import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Processing Job API", () => {
  let accessToken: string;

  let documentId: string;

  let jobId: string;

  beforeAll(async () => {
    const email = `admin${Date.now()}@example.com`;

    const register = await request(app)
      .post("/api/auth/register")
      .send({
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

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "Password@123",
      });

    expect(login.status).toBe(200);

    accessToken = login.body.data.accessToken;

    const upload = await request(app)
      .post("/api/documents/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach(
        "file",
        path.resolve(__dirname, "../../tests/files/sample.pdf"),
      );

    expect(upload.status).toBe(201);

    documentId = upload.body.data.id;
  });

  it("should create a processing job", async () => {
  const response = await request(app)
    .post(`/api/processing-jobs/documents/${documentId}/process`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  jobId = response.body.data.id;
});

it("should list processing jobs", async () => {
  const response = await request(app)
    .get("/api/processing-jobs")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.jobs).toBeInstanceOf(Array);

  expect(response.body.data.pagination).toBeDefined();
});

it("should get processing job by id", async () => {
  const response = await request(app)
    .get(`/api/processing-jobs/${jobId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.id).toBe(jobId);
});

it("should update processing job", async () => {
  const response = await request(app)
    .patch(`/api/processing-jobs/${jobId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      status: "RUNNING",
    });

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.status).toBe("RUNNING");
});

it("should reject duplicate processing job", async () => {
  const response = await request(app)
    .post(`/api/processing-jobs/documents/${documentId}/process`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(400);

  expect(response.body.success).toBe(false);
});

it("should return 404 for invalid document", async () => {
  const response = await request(app)
    .post("/api/processing-jobs/documents/invalid-id/process")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(404);

  expect(response.body.success).toBe(false);
});

it("should reject unauthorized access", async () => {
  const response = await request(app)
    .get("/api/processing-jobs");

  expect(response.status).toBe(401);

  expect(response.body.success).toBe(false);
});

});