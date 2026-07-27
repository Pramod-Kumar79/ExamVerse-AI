import path from "path";
import fs from "fs";

import request from "supertest";

import app from "../app";
import { prisma } from "../lib/prisma";

jest.setTimeout(30000);

describe("Document API", () => {
  let accessToken: string;
  let documentId: string;

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
      where: { email },
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
  });

  it("should upload a document", async () => {
  const response = await request(app)
    .post("/api/documents/upload")
    .set("Authorization", `Bearer ${accessToken}`)
    .attach("file", path.resolve(__dirname, "../../tests/files/sample.pdf"));

  expect(response.status).toBe(201);

  expect(response.body.success).toBe(true);

  expect(response.body.data.originalName).toBe("sample.pdf");

  documentId = response.body.data.id;
});

it("should list documents", async () => {
  const response = await request(app)
    .get("/api/documents")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.documents).toBeInstanceOf(Array);

  expect(response.body.data.pagination).toBeDefined();
});

it("should get document by id", async () => {
  const response = await request(app)
    .get(`/api/documents/${documentId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);

  expect(response.body.data.id).toBe(documentId);

  expect(response.body.data.downloadUrl).toBeDefined();
});

it("should delete a document", async () => {
  const response = await request(app)
    .delete(`/api/documents/${documentId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);

  expect(response.body.success).toBe(true);
});

it("should reject upload without file", async () => {
  const response = await request(app)
    .post("/api/documents/upload")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(400);

  expect(response.body.success).toBe(false);
});

it("should reject unauthorized upload", async () => {
  const response = await request(app)
    .post("/api/documents/upload")
    .attach("file", path.resolve(__dirname, "../../tests/files/sample.pdf"));

  expect(response.status).toBe(401);

  expect(response.body.success).toBe(false);
});

});