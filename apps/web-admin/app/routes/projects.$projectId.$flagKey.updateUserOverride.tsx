import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { $params, $path } from "remix-routes";
import { Button } from "~/components/button";
import { updateUserFlagOverride } from "~/data/projects.server";

type CreateUserOverrideProps = {
  projectId: string;
  flagKey: string;
  userId: string;
  enabled: boolean;
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { projectId, flagKey } = $params(
    "/projects/:projectId/:flagKey/updateUserOverride",
    params,
  );
  const formData = await request.formData();
  const userId = String(formData.get("userId"));
  const enabled = Boolean(formData.get("enabled"));

  const errors: Record<string, string> = {};

  if (!userId) {
    errors.id = "User ID is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors, ok: false });
  }

  try {
    await updateUserFlagOverride(
      projectId,
      flagKey,
      { userId, enabled },
      context,
    );
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: e, ok: false });
  }
};

export function UpdateUserOverride({
  projectId,
  flagKey,
  userId,
  enabled,
}: CreateUserOverrideProps) {
  const fetcher = useFetcher<typeof action>({
    key: `update-user-override_${projectId}_${flagKey}`,
  });

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      form.current?.reset();
    }
  }, [fetcher.data?.ok, fetcher.state]);

  return (
    <fetcher.Form
      action={$path("/projects/:projectId/:flagKey/updateUserOverride", {
        projectId,
        flagKey,
      })}
      method="PATCH"
      ref={form}
    >
      <input type="hidden" value={userId} name="userId" />
      {enabled && <input type="hidden" value="checked" name="enabled" />}
      <Button disabled={fetcher.state !== "idle"} type="submit">
        Update
      </Button>
    </fetcher.Form>
  );
}
