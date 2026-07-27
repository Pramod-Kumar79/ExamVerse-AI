import request from "supertest";
import app from "../app";

import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";

describe("Institute API", () => {
  let accessToken = "";
  let instituteId = "";

  beforeAll(async () => {
    const email = `admin${Date.now()}@example.com`;

    await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email,
      password: "Password@123",
    });

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Password@123",
    });

    accessToken = login.body.data.accessToken;
  });

  it("should create an institute", async () => {
    const response = await request(app)
      .post("/api/institutes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Indian Institute of Technology Kharagpur",
        code: `IITKGP-${Date.now()}`,
        address: "Kharagpur, West Bengal",
        website: "https://www.iitkgp.ac.in",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);

    instituteId = response.body.data.id;
  });

  it("should list institutes", async () => {
    const response = await request(app)
      .get("/api/institutes")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.institutes).toBeInstanceOf(Array);

    expect(response.body.data.pagination).toBeDefined();
  });

  it("should get institute by id", async () => {
    const response = await request(app)
      .get(`/api/institutes/${instituteId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBe(instituteId);
  });

  it("should update an institute", async () => {
    const response = await request(app)
      .patch(`/api/institutes/${instituteId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "IIT Kharagpur Updated",
        address: "Kharagpur, WB",
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name).toBe("IIT Kharagpur Updated");

    expect(response.body.data.address).toBe("Kharagpur, WB");
  });

  it("should delete an institute", async () => {
    const response = await request(app)
      .delete(`/api/institutes/${instituteId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should return 404 for deleted institute", async () => {
    const response = await request(app)
      .get(`/api/institutes/${instituteId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);

    expect(response.body.success).toBe(false);
  });

  it("should reject unauthorized request", async () => {
    const response = await request(app).get("/api/institutes");

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);
  });

  it("should reject invalid institute payload", async () => {
    const response = await request(app)
      .post("/api/institutes")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "",
        code: "",
      });

    expect(response.status).toBe(400);

    expect(response.body.success).toBe(false);
  });

});
