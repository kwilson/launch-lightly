import {
  Box,
  Flex,
  Heading,
  Text,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { redirect, json, useLoaderData, Form } from "@remix-run/react";
import { $params, $path } from "remix-routes";
import { Button } from "~/components/button";
import { FlagForm } from "~/components/flag-form";
import { createProjectFlag, getProjectDetails } from "~/data/projects.server";
import { sizing } from "~/theme";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { projectId } = $params("/projects/:projectId", params);
  const project = await getProjectDetails(projectId, context);

  if (!project) {
    throw redirect($path("/"));
  }

  return json({ project });
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { projectId } = $params("/projects/:projectId", params);
  const formData = await request.formData();
  const key = String(formData.get("key"));
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const defaultEnabled = Boolean(formData.get("defaultEnabled"));

  const errors: Record<string, string> = {};

  if (!key) {
    errors.id = "Key is required";
  }

  if (!title) {
    errors.title = "Title is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    await createProjectFlag(
      projectId,
      { key, title, description, defaultEnabled },
      context,
    );
    return redirect($path("/projects/:projectId", { projectId }));
  } catch (e) {
    console.error(e);
    return json({ error: e });
  }
};

export default function CreateFlag() {
  const { project } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Flex flexDirection="column" gap="3rem">
        <Box>
          <Flex justifyContent="space-between" mb="2rem">
            <Heading as="h2">
              {project.title} ({project.id})
            </Heading>
            <Button
              to={$path("/projects/:projectId", { projectId: project.id })}
            >
              View Project
            </Button>
          </Flex>

          {project.description && <Text as="p">{project.description}</Text>}
        </Box>

        <Box>
          <Heading fontSize="2rem" mb="1rem" as="h3">
            Create Flag
          </Heading>

          <Box
            bg="ivory.100"
            borderColor="cerulean.500"
            borderWidth={1}
            p={sizing.blockSpacing}
            rounded={6}
            mx={`-${sizing.blockSpacing}`}
          >
            <Flex flexDir="column" as={Form} method="post" gap="2rem">
              <FlagForm />

              <Box alignSelf="flex-start">
                <Button type="submit">Create Flag</Button>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
