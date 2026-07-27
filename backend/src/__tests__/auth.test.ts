import request from "supertest";
import app from "../app";

describe("Authentication API", () => {
  let accessToken: string;
  let refreshCookie: string;  
  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "Password@123",
  };

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it("should login successfully", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeDefined();

    accessToken = response.body.data.accessToken;

    refreshCookie = response.headers["set-cookie"][0];

    expect(accessToken).toBeDefined();
    expect(refreshCookie).toBeDefined();
  });

  it("should refresh access token", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshCookie);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

  it("should logout successfully", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", refreshCookie);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should logout from all devices", async () => {
    const response = await request(app)
      .post("/api/auth/logout-all")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);
  });

});
