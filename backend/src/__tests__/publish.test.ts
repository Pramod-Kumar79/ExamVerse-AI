import request from "supertest";
import { prisma } from "../lib/prisma";

import app from "../app";

import { loginAsTeacher } from "./helpers/auth";
import {
  createUploadedDocument,
  createPendingAIQuestion,
  createProcessingJob,
} from "./helpers/factories";

describe("Publish API", () => {
  let auth: Awaited<ReturnType<typeof loginAsTeacher>>;
  let questionId: string;

  beforeAll(async () => {
    auth = await loginAsTeacher();

    const document = await createUploadedDocument(auth.user.id);
    
    const processingJob = await createProcessingJob(document.id);

    const question = await createPendingAIQuestion(
      processingJob.id,
      document.id,
    );

    questionId = question.id;

    await request(app)
      .patch(`/api/ai-review/${questionId}/approve`)
      .set("Authorization", `Bearer ${auth.accessToken}`);
  });

  it("should publish an approved AI question", async () => {
    const response = await request(app)
      .post(`/api/ai-review/${questionId}/publish`)
      .set("Authorization", `Bearer ${auth.accessToken}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data.id).toBeDefined();

    expect(response.body.data.aiGenerated).toBe(true);

    expect(response.body.data.createdById).toBe(auth.user.id);

    const extracted = await prisma.aIExtractedQuestion.findUnique({
      where: {
        id: questionId,
      },
    });

    expect(extracted).not.toBeNull();

    expect(extracted?.approvedAt).not.toBeNull();

    expect(extracted?.publishedQuestionId).toBe(response.body.data.id);

  });

  it("should not publish an already published question", async () => {
    const response = await request(app)
      .post(`/api/ai-review/${questionId}/publish`)
      .set("Authorization", `Bearer ${auth.accessToken}`);

    expect(response.status).toBe(409);

    expect(response.body.success).toBe(false);
  });
});
