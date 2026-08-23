import request from "supertest";

import app from "../app";

import { loginAsTeacher } from "./helpers/auth";
import {
  createUploadedDocument,
  createPendingAIQuestion,
  createProcessingJob,
} from "./helpers/factories";

describe("AI Review API", () => {
  let auth: Awaited<ReturnType<typeof loginAsTeacher>>;
  let accessToken: string;
  let questionId: string;
  let processingJobId: string;

  beforeAll(async () => {
    auth = await loginAsTeacher();

    accessToken = auth.accessToken;

    const document = await createUploadedDocument(auth.user.id);

    const processingJob = await createProcessingJob(document.id);
    processingJobId = processingJob.id;

    const question = await createPendingAIQuestion(
      processingJob.id,
      document.id,
    );

    questionId = question.id;
  });

  it("should fetch pending AI questions", async () => {
    const response = await request(app)
      .get(`/api/ai-review/jobs/${processingJobId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should return null for a non-existent AI question", async () => {
    const response = await request(app)
      .get("/api/ai-review/non-existent-id")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeNull();
  });

  it("should approve an AI question", async () => {
    const response = await request(app)
      .patch(`/api/ai-review/${questionId}/approve`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.status).toBe("APPROVED");
  });

  it("should reject an AI question", async () => {
    const document = await createUploadedDocument(auth.user.id);


    const processingJob = await createProcessingJob(document.id);

    const question = await createPendingAIQuestion(
      processingJob.id,
      document.id,
    );

    const response = await request(app)
      .patch(`/api/ai-review/${question.id}/reject`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.status).toBe("REJECTED");
  });

});
