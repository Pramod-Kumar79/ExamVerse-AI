import request from "supertest";

import app from "../../app";

import { createTeacher } from "./factories";

export async function loginAsTeacher() {
  const { user, password } = await createTeacher();

  const response = await request(app).post("/api/auth/login").send({
    email: user.email,
    password,
  });

  return {
    accessToken: response.body.data.accessToken,
    refreshCookie: response.headers["set-cookie"]?.[0],
    user,
  };
}
