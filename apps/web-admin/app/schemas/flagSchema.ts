import { z } from "zod";
import { userFlagSchema } from "./userFlagSchema";

export type Flag = z.infer<typeof flagSchema>;

export const flagSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  defaultEnabled: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),

  userFlags: z.array(userFlagSchema).default([]),
});
