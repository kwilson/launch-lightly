import { Hono } from "hono";
import { cors } from "hono/cors";
import { validator } from "hono/validator";
import {
  createProject,
  getAllProjects,
  getProjectDetails,
} from "../data/projects";
import {
  createFlag,
  deleteFlag,
  getFlagsForUser,
  updateFlag,
} from "../data/flags";
import { z } from "zod";
import { streamSSE } from "hono/streaming";
import {
  createUserFlag,
  deleteUserFlag,
  updateUserFlag,
} from "../data/userFlags";

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

projects.get("/:projectId/flags/:userId", async (c) => {
  const projectId = c.req.param("projectId");
  const userId = c.req.param("userId");

  const flags = await getFlagsForUser({ projectId, userId });
  return c.json(flags);
});

projects.get("/:projectId/flags/:userId/listen", async (c) => {
  const projectId = c.req.param("projectId");
  const userId = c.req.param("userId");

  return streamSSE(c, async (stream) => {
    let open = true;

    stream.onAbort(() => {
      stream.close();
      open = false;
    });

    while (open) {
      const data = await getFlagsForUser({ projectId, userId });
      await stream.writeSSE({
        data: JSON.stringify(data),
        event: "message",
      });

      await stream.sleep(2000);
    }
  });
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

const updateFlagSchema = newFlagSchema;

projects.patch(
  "/:projectId/:flagId",
  validator("json", (value, c) => {
    const parsed = updateFlagSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const projectId = c.req.param("projectId");
    const flagId = c.req.param("flagId");
    const flag = c.req.valid("json");
    const result = await updateFlag({ projectId, flagId, ...flag });
    return c.json(result, 201);
  },
);

projects.delete("/:projectId/:flagId", async (c) => {
  const projectId = c.req.param("projectId");
  const flagId = c.req.param("flagId");
  const result = await deleteFlag({ projectId, flagId });
  return c.json(result, 201);
});

// User flags
const newUserFlagSchema = z.object({
  userId: z.string(),
  enabled: z.boolean().default(false),
});

projects.post(
  "/:projectId/:flagKey/user-flag",
  validator("json", (value, c) => {
    const parsed = newUserFlagSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const projectId = c.req.param("projectId");
    const flagKey = c.req.param("flagKey");
    const userFlag = c.req.valid("json");
    const result = await createUserFlag({ projectId, flagKey, ...userFlag });
    return c.json(result, 201);
  },
);

projects.patch(
  "/:projectId/:flagKey/user-flag",
  validator("json", (value, c) => {
    const parsed = newUserFlagSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const projectId = c.req.param("projectId");
    const flagKey = c.req.param("flagKey");
    const userFlag = c.req.valid("json");
    const result = await updateUserFlag({ projectId, flagKey, ...userFlag });
    return c.json(result, 201);
  },
);

projects.delete(
  "/:projectId/:flagKey/user-flag",
  validator("json", (value, c) => {
    const parsed = newUserFlagSchema.safeParse(value);
    if (!parsed.success) {
      return c.json(parsed.error, 401);
    }

    return parsed.data;
  }),
  async (c) => {
    const projectId = c.req.param("projectId");
    const flagKey = c.req.param("flagKey");
    const userFlag = c.req.valid("json");
    const result = await deleteUserFlag({ projectId, flagKey, ...userFlag });
    return c.json(result, 201);
  },
);
