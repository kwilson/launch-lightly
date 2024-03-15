import { Flex, FormLabel, HStack, Input, Switch } from "@chakra-ui/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { $params, $path } from "remix-routes";
import { Button } from "~/components/button";
import { createUserFlagOverride } from "~/data/projects.server";

type CreateUserOverrideProps = {
  projectId: string;
  flagKey: string;
};

export const action = async ({
  params,
  request,
  context,
}: ActionFunctionArgs) => {
  const { projectId, flagKey } = $params(
    "/projects/:projectId/:flagKey/createUserOverride",
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
    await createUserFlagOverride(
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

export function CreateUserOverride({
  projectId,
  flagKey,
}: CreateUserOverrideProps) {
  const fetcher = useFetcher<typeof action>({
    key: `create-user-override_${projectId}_${flagKey}`,
  });

  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      form.current?.reset();
    }
  }, [fetcher.data?.ok, fetcher.state]);

  return (
    <fetcher.Form
      action={$path("/projects/:projectId/:flagKey/createUserOverride", {
        projectId,
        flagKey,
      })}
      method="POST"
      ref={form}
    >
      <Flex
        as="fieldset"
        disabled={fetcher.state !== "idle"}
        alignItems="center"
        justifyContent="space-between"
      >
        <FormLabel fontWeight={800}>
          User ID
          <Input bg="white" name="userId" required placeholder="user-id" />
        </FormLabel>

        <FormLabel fontWeight={800}>
          Enabled
          <HStack>
            <Switch size="lg" value="checked" name="enabled" />
          </HStack>
        </FormLabel>

        <Button disabled={fetcher.state !== "idle"} type="submit">
          Add
        </Button>
      </Flex>
    </fetcher.Form>
  );
}
