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
import { ApiHeartbeat } from "./components/api-heartbeat/ApiHeartbeat";

export const links: LinksFunction = () => [
  { as: "style", href: stylesheet, rel: "stylesheet" },
];

export const loader = async () => {
  const { API_PUBLIC_URL } = environment();
  return json({ apiBaseUrl: API_PUBLIC_URL });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { apiBaseUrl } = useLoaderData<typeof loader>();

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

        {/* <p>API Connection: {running ? "Active" : "Disconnected"}</p> */}
        <ApiHeartbeat apiBaseUrl={apiBaseUrl} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
