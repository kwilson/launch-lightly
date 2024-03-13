import {
  ActionFunctionArgs,
  json,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData, Form } from "@remix-run/react";
import { createProject, getAllProjects } from "~/data/projects.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export const loader = async () => {
  const projects = await getAllProjects();
  return json({ projects });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));

  const errors: Record<string, string> = {};

  if (!id) {
    errors.id = "ID is required";
  }

  if (!title) {
    errors.title = "Title is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    const newProject = await createProject({ id, title, description });
    return json({ newProject });
  } catch (e) {
    console.error(e);
    return json({ error: e });
  }
};

export default function Index() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-2xl">Launch Lightly</h1>

      <h2>Project List</h2>
      {projects.length > 0 ? (
        <p>{projects.length} projects</p>
      ) : (
        <p>No Projects</p>
      )}

      <h2>Create a project</h2>
      <Form className="flex flex-col" method="post">
        <label>
          ID
          <input name="id" required defaultValue="my-first-project" />
        </label>

        <label>
          Title
          <input name="title" required defaultValue="My First Project" />
        </label>

        <label>
          Description
          <textarea name="description" defaultValue="Hello world" />
        </label>

        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
