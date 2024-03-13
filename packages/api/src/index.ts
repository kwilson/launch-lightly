import { Hono } from "hono";
import { heartbeat } from "./heartbeat";
import { projects } from "./projects";
const app = new Hono();

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
app.route("/heartbeat", heartbeat);
app.route("/projects", projects);

export default app;
