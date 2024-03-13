import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { remixRoutes } from "remix-routes/vite";

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix(),
    tsconfigPaths(),
    remixRoutes({ strict: true }),
  ],
});
