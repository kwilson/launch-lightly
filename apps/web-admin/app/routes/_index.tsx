import { json, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getAllProjects } from "~/data/projects.server";
import { Box, Heading, Flex, VStack, Text } from "@chakra-ui/react";
import { ProjectsList } from "~/components/projects-list";
import { Button } from "~/components/button";
import { $path } from "remix-routes";
import { sizing } from "~/theme";

export const meta: MetaFunction = () => {
  return [
    { title: "launch lightly" },
    {
      name: "description",
      content: "streaming your feature flags",
    },
  ];
};

export const loader = async () => {
  const projects = await getAllProjects();
  return json({ projects });
};

export default function Index() {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <Box>
      <Flex justifyContent="space-between" mb="2rem">
        <Heading as="h2">Your Projects</Heading>
        <Button to={$path("/projects/create")}>New Project</Button>
      </Flex>

      <Box
        bg="ivory.100"
        borderColor="cerulean.500"
        borderWidth={1}
        p={sizing.blockSpacing}
        rounded={6}
        mx={`-${sizing.blockSpacing}`}
      >
        {projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <VStack>
            <Text align="center">You don't have any projects.</Text>
            <Button to={$path("/projects/create")}>Create A New Project</Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
}
