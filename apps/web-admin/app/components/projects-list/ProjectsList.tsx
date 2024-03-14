import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { $path } from "remix-routes";
import { Link } from "@remix-run/react";
import { Button } from "../button";

type Project = {
  id: string;
  title: string;
};

type ProjectsListProps = {
  projects: Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {projects.map((project) => (
            <Tr key={project.id} _hover={{ backgroundColor: "#00000010" }}>
              <Td width={0}>
                <Link
                  to={$path("/projects/:projectId", {
                    projectId: project.id,
                  })}
                  prefetch="intent"
                >
                  {project.id}
                </Link>
              </Td>
              <Td>
                <Link
                  to={$path("/projects/:projectId", {
                    projectId: project.id,
                  })}
                  prefetch="intent"
                >
                  {project.title}
                </Link>
              </Td>
              <Td align="right" textAlign="right" width="min-content">
                <Button
                  prefetch="intent"
                  to={$path("/projects/:projectId", {
                    projectId: project.id,
                  })}
                >
                  view
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
