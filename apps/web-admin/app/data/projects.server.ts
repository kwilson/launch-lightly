import { AppLoadContext } from "@remix-run/cloudflare";
import { z } from "zod";
import { environment } from "~/environment.server";

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
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

export async function createProject(
  project: z.infer<typeof projectSchema>,
  ctx: AppLoadContext,
) {
  const { API_PUBLIC_URL } = environment(ctx.cloudflare.env);
  const data = await fetch(`${API_PUBLIC_URL}/projects`, {
    method: "POST",
    body: JSON.stringify(project),
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
