import { useEffect, useState } from "react";
import z from "zod";

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
  const url = `${apiBaseUrl}/projects/${projectId}/flags/${userId}`;
  const [flags, setFlags] = useState<z.infer<typeof flagSchema>["flags"]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function getData() {
      const response = await fetch(url);
      const parsed = flagSchema.safeParse(await response.json());

      if (parsed.success) {
        if (lastUpdated !== parsed.data.lastUpdated) {
          setFlags(parsed.data.flags);
          setLastUpdated(parsed.data.lastUpdated);
        }
      } else {
        console.error(parsed.error);
      }
    }

    getData();
  }, [url, lastUpdated, setFlags, setLastUpdated]);

  return { flags };
}
