import type { z } from "zod";
import type { registerInstituteSchema } from "../schemas/auth.schema";

export type RegisterInstituteDto = z.infer<typeof registerInstituteSchema>;
