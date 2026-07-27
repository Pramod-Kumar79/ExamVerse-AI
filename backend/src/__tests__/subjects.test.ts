import request from "supertest";
import app from "../app";
import { prisma } from "../lib/prisma";

describe("Subject API", () => {
  let accessToken: string;
  let subjectId: string;

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
 });

  // tests go here

  it("should create a subject", async () => {
    const response = await request(app)
      .post("/api/subjects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Physics",
        code: `PHY-${Date.now()}`,
      });

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    subjectId = response.body.data.id;
  });

  it("should list subjects", async () => {
    const response = await request(app)
      .get("/api/subjects")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.subjects).toBeInstanceOf(Array);

    expect(response.body.data.pagination).toBeDefined();
  });

  it("should get subject by id", async () => {
    const response = await request(app)
      .get(`/api/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBe(subjectId);
  });

  it("should update a subject", async () => {
    const response = await request(app)
      .patch(`/api/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Advanced Physics",
        code: `PHY-ADV-${Date.now()}`,
      });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.name).toBe("Advanced Physics");

    expect(response.body.data.code).toContain("PHY-ADV");
  });

  it("should soft delete a subject", async () => {
    const response = await request(app)
      .delete(`/api/subjects/${subjectId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

    it("should mark subject as inactive after deletion", async () => {
    const response = await request(app)
        .get(`/api/subjects/${subjectId}`)
        .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.isActive).toBe(false);
    });

    it("should reject unauthorized request", async () => {
      const response = await request(app).get("/api/subjects");

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject invalid subject payload", async () => {
      const response = await request(app)
        .post("/api/subjects")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          name: "",
          code: "",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
});
