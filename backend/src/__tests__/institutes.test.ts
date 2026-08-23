import request from "supertest";
import app from "../app";

import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";

jest.setTimeout(30000);

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

  it("should handle institute registration, pending approval block, approval, and suspension flow", async () => {
    const instCode = `INST-FLOW-${Date.now()}`;
    const instEmail = `inst.admin.${Date.now()}@example.com`;
    const instPassword = "Password@123";

    // 1. Register Institute
    const regRes = await request(app)
      .post("/api/auth/register-institute")
      .send({
        instituteName: "Institute Flow Academy",
        instituteCode: instCode,
        name: "Flow Admin",
        email: instEmail,
        password: instPassword,
      });

    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    const flowInstId = regRes.body.data.instituteId;

    // 2. Attempt login before approval -> expect 401
    const pendingLoginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: instEmail,
        password: instPassword,
      });

    expect(pendingLoginRes.status).toBe(401);
    expect(pendingLoginRes.body.message).toContain("pending admin approval");

    // 3. Admin approves institute
    const approveRes = await request(app)
      .patch(`/api/institutes/${flowInstId}/approve`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.isApproved).toBe(true);
    expect(approveRes.body.data.status).toBe("APPROVED");

    // 4. Login after approval -> expect 200
    const approvedLoginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: instEmail,
        password: instPassword,
      });

    expect(approvedLoginRes.status).toBe(200);
    expect(approvedLoginRes.body.success).toBe(true);

    // 5. Admin suspends institute
    const suspendRes = await request(app)
      .patch(`/api/institutes/${flowInstId}/suspend`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(suspendRes.status).toBe(200);
    expect(suspendRes.body.data.isSuspended).toBe(true);
    expect(suspendRes.body.data.status).toBe("SUSPENDED");

    // 6. Login while suspended -> expect 401
    const suspendedLoginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: instEmail,
        password: instPassword,
      });

    expect(suspendedLoginRes.status).toBe(401);
    expect(suspendedLoginRes.body.message).toContain("suspended");

    // 7. Admin reactivates institute
    const reactivateRes = await request(app)
      .patch(`/api/institutes/${flowInstId}/reactivate`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(reactivateRes.status).toBe(200);
    expect(reactivateRes.body.data.isSuspended).toBe(false);
  });
});
