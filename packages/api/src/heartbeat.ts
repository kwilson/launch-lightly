import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";

export const heartbeat = new Hono();
heartbeat.use("/*", cors());

heartbeat.get("/", (c) => c.json({ running: true }));

heartbeat.get("/listen", async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const data = {
        time: new Date().toISOString(),
        alive: true,
      };

      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: JSON.stringify(data),
        event: "message",
      });

      await stream.sleep(15000);
    }
  });
});
