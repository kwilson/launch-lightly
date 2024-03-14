import { PropsWithChildren, createContext, useMemo } from "react";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { useUserFlags } from "..";

type LaunchLightlyContextProps = {
  projectId: string;
  userId: string;
};

type LaunchLightlyContextState = {
  flags: string[];
  connected: boolean;
  projectId: string;
};

export const LaunchLightlyContextObject =
  createContext<LaunchLightlyContextState>({
    flags: [],
    connected: false,
    projectId: "",
  });

const apiBaseUrl = "http://localhost:3002";

export function LaunchLightlyContext({
  children,
  projectId,
  userId,
}: PropsWithChildren<LaunchLightlyContextProps>) {
  const { connected } = useHeartbeat(apiBaseUrl);

  const { flags } = useUserFlags(apiBaseUrl, { projectId, userId });

  const state: LaunchLightlyContextState = useMemo(
    () => ({
      flags,
      connected,
      projectId,
    }),
    [flags, connected, projectId],
  );

  return (
    <LaunchLightlyContextObject.Provider value={state}>
      {children}
    </LaunchLightlyContextObject.Provider>
  );
}
