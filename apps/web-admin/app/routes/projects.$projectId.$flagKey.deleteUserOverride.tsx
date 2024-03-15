import { Button } from "@chakra-ui/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { $params, $path } from "remix-routes";
import { deleteUserFlagOverride } from "~/data/projects.server";

type CreateUserOverrideProps = {
  projectId: string;
  flagKey: string;
  userId: string;
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { projectId, flagKey } = $params(
    "/projects/:projectId/:flagKey/deleteUserOverride",
    params,
  );
  const formData = await request.formData();
  const userId = String(formData.get("userId"));

  const errors: Record<string, string> = {};

  if (!userId) {
    errors.id = "User ID is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors, ok: false });
  }

  try {
    await deleteUserFlagOverride(projectId, flagKey, { userId }, context);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: e, ok: false });
  }
};

export function DeleteUserOverride({
  projectId,
  flagKey,
  userId,
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
      action={$path("/projects/:projectId/:flagKey/deleteUserOverride", {
        projectId,
        flagKey,
      })}
      method="DELETE"
      ref={form}
    >
      <input type="hidden" value={userId} name="userId" />
      <Button
        colorScheme="red"
        disabled={fetcher.state !== "idle"}
        type="submit"
      >
        Delete
      </Button>
    </fetcher.Form>
  );
}
