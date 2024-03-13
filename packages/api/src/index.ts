import { Hono } from "hono";
import { heartbeat } from "./heartbeat";
const app = new Hono();

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.route("/heartbeat", heartbeat);

export default app;
