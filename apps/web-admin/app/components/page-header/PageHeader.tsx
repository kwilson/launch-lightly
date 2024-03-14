import {
  Box,
  Container,
  Image,
  Heading,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { sizing } from "~/theme";

import logo from "~/images/launch-lightly-logo.png";
import { ApiHeartbeat } from "../api-heartbeat/ApiHeartbeat";
import { Link } from "@remix-run/react";
import { $path } from "remix-routes";

type PageHeaderProps = {
  apiBaseUrl: string;
};

export function PageHeader({ apiBaseUrl }: PageHeaderProps) {
  return (
    <Box bg="cerulean.500" bgColor="cerulean.500">
      <Container
        as="header"
        color="ivory.500"
        textTransform="lowercase"
        maxW={sizing.contentsMaxWidth}
        mx="auto"
        p={sizing.blockSpacing}
      >
        <Flex gap="1rem" alignItems="center">
          <Link style={{ display: "contents" }} to={$path("/")}>
            <Image height="4rem" alt="" src={logo} />

            <VStack align="start" spacing={0}>
              <Heading fontWeight={800} fontSize="2rem">
                Launch Lightly
              </Heading>
              <Text as="p" fontWeight={600} marginTop="-.5rem">
                streaming your feature flags
              </Text>
            </VStack>
          </Link>

          <Box ml="auto">
            <ApiHeartbeat apiBaseUrl={apiBaseUrl} />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
