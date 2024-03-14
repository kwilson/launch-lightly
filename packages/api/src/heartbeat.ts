import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";

export const heartbeat = new Hono();
heartbeat.use("/*", cors());

heartbeat.get("/", (c) => c.json({ running: true }));

heartbeat.get("/listen", async (c) => {
  return streamSSE(c, async (stream) => {
    let open = true;

    stream.onAbort(() => {
      stream.close();
      open = false;
    });

    while (open) {
      const data = {
        time: new Date().toISOString(),
        alive: true,
      };

      await stream.writeSSE({
        data: JSON.stringify(data),
        event: "message",
      });

      await stream.sleep(15000);
    }
  });
});
