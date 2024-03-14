import { useEffect, useState } from "react";
import { z } from "zod";
import { Box, HStack, Text } from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

type ApiHeartbeatProps = {
  apiBaseUrl: string;
};

const heartbeatSchema = z.object({
  time: z.coerce.date(),
  alive: z.boolean(),
});

export function ApiHeartbeat({ apiBaseUrl }: ApiHeartbeatProps) {
  const [isAlive, setIsAlive] = useState(false);

  useEffect(() => {
    const sse = new EventSource(`${apiBaseUrl}/heartbeat/listen`);

    const onMessage = (ev: MessageEvent) => {
      const parsed = heartbeatSchema.safeParse(JSON.parse(ev.data));
      setIsAlive(parsed.success && parsed.data.alive);
    };

    const onError = (ev: MessageEvent) => {
      console.error(ev);
    };

    sse.addEventListener("message", onMessage);
    sse.addEventListener("error", onError);

    sse.onerror = () => {
      console.error("error");
      sse.close();
    };

    return () => {
      sse.removeEventListener("message", onMessage);
      sse.removeEventListener("error", onError);
      sse.close();
    };
  }, [apiBaseUrl]);

  return (
    <HStack fontWeight={800} alignItems="center">
      <Text as="span">API Status</Text>
      <Box fontSize="1.4em">
        {isAlive ? <CheckCircleIcon /> : <WarningIcon />}
      </Box>
    </HStack>
  );
}
