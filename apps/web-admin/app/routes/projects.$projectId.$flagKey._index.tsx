import { Box, Flex, Heading, Button as ChakraButton } from "@chakra-ui/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { $params, $path } from "remix-routes";
import { Button } from "~/components/button";
import { FlagForm } from "~/components/flag-form";
import { getProjectDetails, updateProjectFlag } from "~/data/projects.server";
import { sizing } from "~/theme";
import { DeleteFlagModal } from "./projects.$projectId.$flagId.delete";
import { CreateUserOverride } from "./projects.$projectId.$flagKey.createUserOverride";
import { UserFlagOverridesList } from "~/components/user-flag-overrides-list.tsx";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { projectId, flagKey } = $params(
    "/projects/:projectId/:flagKey",
    params,
  );

  const project = await getProjectDetails(projectId, context);
  const flag = project?.flags.find((flag) => flag.key === flagKey);

  if (!project || !flag) {
    throw redirect($path("/"));
  }

  return json({ project, flag });
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { projectId } = $params("/projects/:projectId/:flagKey", params);
  const formData = await request.formData();
  const flagId = String(formData.get("id"));
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
    await updateProjectFlag(
      projectId,
      flagId,
      { key, title, description, defaultEnabled },
      context,
    );
    return redirect($path("/projects/:projectId", { projectId }));
  } catch (e) {
    console.error(e);
    return json({ error: e });
  }
};

export default function FlagAdmin() {
  const { project, flag } = useLoaderData<typeof loader>();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <Box>
        <Flex flexDirection="column" gap="3rem">
          <Box>
            <Flex justifyContent="space-between" mb="2rem">
              <Heading as="h2">
                {flag.title} ({flag.key})
              </Heading>
              <Button
                to={$path("/projects/:projectId", { projectId: project.id })}
              >
                View Project
              </Button>
            </Flex>
          </Box>

          <Box>
            <Heading fontSize="2rem" mb="1rem" as="h3">
              Flag Details
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
                <input type="hidden" name="id" value={flag.id} />

                <FlagForm flag={flag} />

                <Box alignSelf="stretch">
                  <Flex justifyContent="space-between">
                    <Button type="submit">Update Flag</Button>
                    <ChakraButton
                      onClick={() => setIsDeleting(true)}
                      colorScheme="red"
                      type="button"
                    >
                      Delete Flag
                    </ChakraButton>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Box>

          <Box>
            <Heading fontSize="1.8rem" mb="1rem" as="h3">
              User Overrides
            </Heading>

            <Box
              bg="ivory.100"
              borderColor="cerulean.500"
              borderWidth={1}
              p={sizing.blockSpacing}
              rounded={6}
              mx={`-${sizing.blockSpacing}`}
            >
              <Flex flexDir="column" gap="2rem">
                {/* <input type="hidden" name="id" value={flag.id} /> */}

                {/* <FlagForm flag={flag} /> */}

                <UserFlagOverridesList
                  flag={flag}
                  projectId={project.id}
                  userFlags={flag.userFlags}
                />
                <CreateUserOverride projectId={project.id} flagKey={flag.key} />
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>

      <DeleteFlagModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        flag={flag}
        projectId={project.id}
      />
    </>
  );
}
