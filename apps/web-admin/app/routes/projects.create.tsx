import {
  Box,
  Flex,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, json } from "@remix-run/react";
import { $path } from "remix-routes";
import { Button } from "~/components/button";
import { createProject } from "~/data/projects.server";
import { sizing } from "~/theme";

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

export default function CreateProject() {
  return (
    <Box>
      <Flex justifyContent="space-between" mb="2rem">
        <Heading as="h2">Create Project</Heading>
        <Button to={$path("/")}>View All Projects</Button>
      </Flex>

      <Box
        bg="ivory.100"
        borderColor="cerulean.500"
        borderWidth={1}
        p={sizing.blockSpacing}
        rounded={6}
        mx={`-${sizing.blockSpacing}`}
      >
        <Flex flexDir="column" as={Form} method="post" gap="2rem">
          <FormLabel fontWeight={800}>
            ID
            <Input bg="white" name="id" required placeholder="my-project" />
          </FormLabel>

          <FormLabel fontWeight={800}>
            Title
            <Input
              bg="white"
              colorScheme="white"
              name="title"
              required
              placeholder="My Project"
            />
          </FormLabel>

          <FormLabel fontWeight={800}>
            Description
            <Textarea bg="white" name="description" />
          </FormLabel>

          <Box alignSelf="flex-start">
            <Button type="submit">Create Project</Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
