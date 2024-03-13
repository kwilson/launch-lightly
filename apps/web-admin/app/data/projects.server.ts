import { z } from "zod";
import { environment } from "~/environment.server";

const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

export async function getAllProjects() {
  const { API_PUBLIC_URL } = environment();
  const data = await fetch(`${API_PUBLIC_URL}/projects`);
  const result = z.array(projectSchema).safeParse(await data.json());

  if (result.success) {
    return result.data;
  }

  return [];
}

export async function createProject(project: z.infer<typeof projectSchema>) {
  const { API_PUBLIC_URL } = environment();
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
