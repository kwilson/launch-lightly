import {
  Switch,
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
import { Button } from "../button/index.js";

type Flag = {
  key: string;
  title: string;
  defaultEnabled?: boolean;
};

type FlagsListProps = {
  projectId: string;
  flags: Flag[];
};

export function FlagsList({ projectId, flags }: FlagsListProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Key</Th>
            <Th>Title</Th>
            <Th textAlign="center">Default Enabled</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {flags.map((flag) => (
            <Tr key={flag.key} _hover={{ backgroundColor: "#00000010" }}>
              <Td width={0}>
                <Link
                  to={$path("/projects/:projectId/:flagKey", {
                    projectId,
                    flagKey: flag.key,
                  })}
                  prefetch="intent"
                >
                  {flag.key}
                </Link>
              </Td>
              <Td>
                <Link
                  to={$path("/projects/:projectId/:flagKey", {
                    projectId,
                    flagKey: flag.key,
                  })}
                  prefetch="intent"
                >
                  {flag.title}
                </Link>
              </Td>
              <Td textAlign="center" width="min-content">
                <Link
                  to={$path("/projects/:projectId/:flagKey", {
                    projectId,
                    flagKey: flag.key,
                  })}
                  prefetch="intent"
                >
                  <Switch defaultChecked={flag.defaultEnabled} readOnly />
                </Link>
              </Td>
              <Td align="right" textAlign="right" width="min-content">
                <Button
                  prefetch="intent"
                  to={$path("/projects/:projectId/:flagKey", {
                    projectId,
                    flagKey: flag.key,
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
