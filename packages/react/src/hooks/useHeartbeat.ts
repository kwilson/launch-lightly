import { useState } from "react";
import z from "zod";
import { useEvents } from "./useEvents";

const heartbeatSchema = z.object({
  time: z.coerce.date(),
  alive: z.boolean(),
});

export function useHeartbeat(apiBaseUrl: string) {
  const url = `${apiBaseUrl}/heartbeat/listen`;
  const [connected, setIsConnected] = useState(false);

  useEvents({
    url,
    schema: heartbeatSchema,
    onMessage(message) {
      setIsConnected(message.alive);
    },
  });

  return { connected };
}
