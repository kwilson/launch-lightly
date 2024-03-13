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
            <Tr key={project.id}>
              <Td>{project.id}</Td>
              <Td>{project.title}</Td>
              <Td align="right">
                <Link
                  to={$path("/projects/:projectId", {
                    projectId: project.id,
                  })}
                >
                  view
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
