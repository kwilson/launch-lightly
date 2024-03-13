import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url";
import { LinksFunction, json } from "@remix-run/cloudflare";
import { environment } from "./environment.server";
import { z } from "zod";

export const links: LinksFunction = () => [
  { as: "style", href: stylesheet, rel: "stylesheet" },
];

const heartbeatSchema = z.object({
  running: z.boolean(),
});

export const loader = async () => {
  const { API_PUBLIC_URL } = environment();
  console.log({ API_PUBLIC_URL });
  const response = await fetch(`${API_PUBLIC_URL}/heartbeat`);
  const parsed = heartbeatSchema.safeParse(await response.json());

  if (parsed.success) {
    return json(parsed.data);
  }

  return json({ running: false });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { running } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <p>API Connection: {running ? "Active" : "Disconnected"}</p>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
