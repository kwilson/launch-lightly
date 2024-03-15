import { AppLoadContext } from "@remix-run/cloudflare";
import { z } from "zod";
import { environment } from "~/environment.server";
import { flagSchema } from "../schemas/flagSchema";
import { Project, projectSchema } from "../schemas/projectSchema";

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
  project: Pick<Project, "id" | "title" | "description">,
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

export async function updateProjectFlag(
  projectId: string,
  flagId: string,
  flag: Pick<
    z.infer<typeof flagSchema>,
    "key" | "title" | "description" | "defaultEnabled"
  >,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const { key, title, description, defaultEnabled } = flag;

  const data = await fetch(
    `${API_PUBLIC_URL}/projects/${projectId}/${flagId}`,
    {
      method: "PATCH",
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

export async function deleteProjectFlag(
  projectId: string,
  flagId: string,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const data = await fetch(
    `${API_PUBLIC_URL}/projects/${projectId}/${flagId}`,
    {
      method: "DELETE",
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
