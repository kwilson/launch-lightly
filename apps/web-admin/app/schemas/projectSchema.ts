import { z } from "zod";
import { flagSchema } from "./flagSchema";

export type Project = z.infer<typeof projectSchema>;

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  flags: z.array(flagSchema).default([]),
});
