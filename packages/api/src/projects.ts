import { Hono } from "hono";
import { cors } from "hono/cors";
import { validator } from "hono/validator";
import {
  createProject,
  getAllProjects,
  getProjectDetails,
} from "../data/projects";
import { createFlag } from "../data/flags";
import { z } from "zod";

export const projects = new Hono();
projects.use("/*", cors());

projects.get("/", async (c) => {
  const allProjects = await getAllProjects();
  return c.json(allProjects);
});

const newProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
});

projects.post(
  "/",
  validator("json", (value, c) => {
    const parsed = newProjectSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const project = c.req.valid("json");
    const result = await createProject(project);
    return c.json(result, 201);
  },
);

projects.get("/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const project = await getProjectDetails(projectId);
  return c.json(project);
});

const newFlagSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  defaultEnabled: z.boolean().optional(),
});

projects.post(
  "/:projectId/create-flag",
  validator("json", (value, c) => {
    const parsed = newFlagSchema.safeParse(value);
    console.log({ parsed });
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const projectId = c.req.param("projectId");
    const flag = c.req.valid("json");
    const result = await createFlag({ projectId, ...flag });
    return c.json(result, 201);
  },
);
