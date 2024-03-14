import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { redirect, useLoaderData } from "@remix-run/react";
import { $params, $path } from "remix-routes";
import { Button } from "~/components/button";
import { FlagsList } from "~/components/flag-list";
import { getProjectDetails } from "~/data/projects.server";
import { sizing } from "~/theme";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { projectId } = $params("/projects/:projectId/create-flag", params);
  const project = await getProjectDetails(projectId, context);

  if (!project) {
    throw redirect($path("/"));
  }

  return json({ project });
};

export default function ProjectDetails() {
  const { project } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Flex flexDirection="column" gap="3rem">
        <Box>
          <Flex justifyContent="space-between" mb="2rem">
            <Heading as="h2">
              {project.title} ({project.id})
            </Heading>
            <Button to={$path("/")}>View All Projects</Button>
          </Flex>

          {project.description && <Text as="p">{project.description}</Text>}
        </Box>

        <Box>
          <Heading fontSize="2rem" mb="1rem" as="h3">
            Flags
          </Heading>
          <Box
            bg="ivory.100"
            borderColor="cerulean.500"
            borderWidth={1}
            p={sizing.blockSpacing}
            rounded={6}
            mx={`-${sizing.blockSpacing}`}
          >
            {project.flags.length > 0 ? (
              <FlagsList projectId={project.id} flags={project.flags} />
            ) : (
              <VStack>
                <Text align="center">You don't have any flags.</Text>
                <Button
                  to={$path("/projects/:projectId/create-flag", {
                    projectId: project.id,
                  })}
                >
                  Create A New Flag
                </Button>
              </VStack>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
