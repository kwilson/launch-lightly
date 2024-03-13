// import dotenv from "dotenv";

// const result = dotenv.config({
//   path: "./.dev.vars",
// });

// if (result.error) {
//   console.error("error loading .env from project root");
//   throw result.error;
// }

import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import app from "./src";

app.use("/*", cors());

serve({
  fetch: app.fetch,
  port: 3002,
});
