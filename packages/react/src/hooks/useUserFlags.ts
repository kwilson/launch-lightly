import { useEffect, useMemo, useState } from "react";
import z from "zod";
import { useEvents } from "./useEvents";

type UseUserFlagsArgs = {
  projectId: string;
  userId: string;
};

const flagSchema = z.object({
  flags: z.array(z.string()),
  lastUpdated: z.string(),
});

export function useUserFlags(
  apiBaseUrl: string,
  { projectId, userId }: UseUserFlagsArgs,
) {
  const url =
    projectId && userId
      ? `${apiBaseUrl}/projects/${projectId}/flags/${userId}`
      : null;
  const listenUrl = `${apiBaseUrl}/projects/${projectId}/flags/${userId}/listen`;

  const [enabledFlags, setEnabledFlags] = useState<
    z.infer<typeof flagSchema>["flags"]
  >([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Reset flags if the user changes
  useEffect(() => {
    setEnabledFlags([]);
    setLastUpdated(null);
  }, [userId]);

  useEffect(() => {
    async function getData(fetchUrl: string) {
      const response = await fetch(fetchUrl);
      const parsed = flagSchema.safeParse(await response.json());

      if (parsed.success) {
        if (lastUpdated !== parsed.data.lastUpdated) {
          setEnabledFlags(parsed.data.flags);
          setLastUpdated(parsed.data.lastUpdated);
        }
      } else {
        console.error(parsed.error);
      }
    }

    if (url) {
      getData(url);
    }
  }, [url, lastUpdated, setEnabledFlags, setLastUpdated]);

  useEvents({
    url: listenUrl,
    schema: flagSchema,
    enabled: Boolean(url),
    onMessage(message) {
      if (message.lastUpdated !== lastUpdated) {
        setEnabledFlags(message.flags);
        setLastUpdated(message.lastUpdated);
      }
    },
  });

  const flags = useMemo<Record<string, boolean>>(
    () =>
      enabledFlags.reduce(
        (collection, key) => ({
          ...collection,
          [key]: true,
        }),
        {},
      ),
    [enabledFlags],
  );

  return { flags };
}
