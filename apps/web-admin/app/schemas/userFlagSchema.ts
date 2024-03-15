import { z } from "zod";

export type UserFlag = z.infer<typeof userFlagSchema>;

export const userFlagSchema = z.object({
  userId: z.string(),
  flagId: z.string(),
  enabled: z.boolean().default(false),
});
