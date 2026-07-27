jest.mock("unpdf");

import path from "path";
import request from "supertest";

import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("PDF Processing API", () => {
  let accessToken: string;
  let documentId: string;

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

    const upload = await request(app)
      .post("/api/documents/upload")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", path.resolve(__dirname, "../../tests/files/sample.pdf"));

    expect(upload.status).toBe(201);

    documentId = upload.body.data.id;
  });

  it("should analyze a PDF document", async () => {
    const response = await request(app)
      .post(`/api/pdf-processing/${documentId}/analyze`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.metadata).toBeDefined();

    expect(response.body.data.pages).toBeInstanceOf(Array);
  });

  it("should return 404 for invalid document", async () => {
    const response = await request(app)
      .post("/api/pdf-processing/invalid-id/analyze")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthorized request", async () => {
    const response = await request(app).post(
      `/api/pdf-processing/${documentId}/analyze`,
    );

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
