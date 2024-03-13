import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.get("/heartbeat", (c) => c.json({ running: true }));

export default app;
