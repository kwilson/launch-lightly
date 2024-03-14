import { AppLoadContext } from "@remix-run/cloudflare";
import { z } from "zod";
import { environment } from "~/environment.server";

const flagSchema = z.object({
  id: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  defaultEnabled: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  flags: z.array(flagSchema).default([]),
});

export async function getAllProjects(ctx: AppLoadContext) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const data = await fetch(`${API_PUBLIC_URL}/projects`);
  const result = z.array(projectSchema).safeParse(await data.json());

  if (result.success) {
    return result.data;
  }

  return [];
}

export async function getProjectDetails(
  projectId: string,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const data = await fetch(`${API_PUBLIC_URL}/projects/${projectId}`);
  const result = projectSchema.safeParse(await data.json());

  if (result.success) {
    return result.data;
  }

  return null;
}

export async function createProject(
  project: Pick<z.infer<typeof projectSchema>, "id" | "title" | "description">,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const { id, title, description } = project;

  const data = await fetch(`${API_PUBLIC_URL}/projects`, {
    method: "POST",
    body: JSON.stringify({ id, title, description }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = projectSchema.safeParse(await data.json());

  if (result.success) {
    return result.data;
  }

  return {};
}

export async function createProjectFlag(
  projectId: string,
  flag: Pick<
    z.infer<typeof flagSchema>,
    "key" | "title" | "description" | "defaultEnabled"
  >,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const { key, title, description, defaultEnabled } = flag;

  const data = await fetch(
    `${API_PUBLIC_URL}/projects/${projectId}/create-flag`,
    {
      method: "POST",
      body: JSON.stringify({ key, title, description, defaultEnabled }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const result = flagSchema.safeParse(await data.json());

  if (result.success) {
    return result.data;
  }

  return {};
}
