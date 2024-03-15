import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";
import { DeleteUserOverride } from "~/routes/projects.$projectId.$flagKey.deleteUserOverride";
import { UpdateUserOverride } from "~/routes/projects.$projectId.$flagKey.updateUserOverride";
import { Flag } from "~/schemas/flagSchema";
import { UserFlag } from "~/schemas/userFlagSchema";

type UserFlagOverridesListProps = {
  projectId: string;
  flag: Flag;
  userFlags: UserFlag[];
};

function UserFlagRow({
  flag,
  userFlag,
  projectId,
}: {
  projectId: string;
  flag: Flag;
  userFlag: UserFlag;
}) {
  const [enabled, setEnabled] = useState(userFlag.enabled);

  return (
    <Tr key={userFlag.userId} _hover={{ backgroundColor: "#00000010" }}>
      <Td>{userFlag.userId}</Td>
      <Td>
        <Switch
          isChecked={enabled}
          onChange={() => setEnabled((current) => !current)}
          size="lg"
        />
      </Td>
      <Td align="right" textAlign="right" width={0}>
        <UpdateUserOverride
          projectId={projectId}
          userId={userFlag.userId}
          flagKey={flag.key}
          enabled={enabled}
        />
      </Td>
      <Td align="right" textAlign="right" width={0}>
        <DeleteUserOverride
          projectId={projectId}
          userId={userFlag.userId}
          flagKey={flag.key}
        />
      </Td>
    </Tr>
  );
}

export function UserFlagOverridesList({
  flag,
  projectId,
  userFlags,
}: UserFlagOverridesListProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th textAlign="left">User</Th>
            <Th textAlign="left">Enabled</Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {userFlags.map((userFlag) => (
            <UserFlagRow
              key={userFlag.userId}
              projectId={projectId}
              userFlag={userFlag}
              flag={flag}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
