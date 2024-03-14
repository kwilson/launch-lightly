import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Box, ChakraProvider, Container } from "@chakra-ui/react";

import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { environment } from "./environment.server";
import { withEmotionCache } from "@emotion/react";
import { useContext, useEffect } from "react";
import { ClientStyleContext, ServerStyleContext } from "./context";
import { theme, sizing } from "./theme";
import { PageHeader } from "./components/page-header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
];

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { API_PUBLIC_URL } = environment(context.cloudflare.env);
  return json({ apiBaseUrl: API_PUBLIC_URL });
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const { apiBaseUrl } = useLoaderData<typeof loader>();
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          <ChakraProvider theme={theme}>
            <Box bg="ivory.500" textColor="black.500" minHeight="100vh">
              <PageHeader apiBaseUrl={apiBaseUrl} />

              <Container
                as="main"
                mx="auto"
                maxWidth={sizing.contentsMaxWidth}
                p={sizing.blockSpacing}
              >
                {children}
              </Container>
            </Box>
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  },
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
