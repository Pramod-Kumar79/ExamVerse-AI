import { z } from "zod";

export const processPdfSchema = z.object({
  documentId: z.string().cuid(),
});
