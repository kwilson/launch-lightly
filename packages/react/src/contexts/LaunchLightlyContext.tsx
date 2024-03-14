import { PropsWithChildren, createContext, useMemo } from "react";
import { useHeartbeat } from "../hooks/useHeartbeat";

type LaunchLightlyContextProps = {
  appId: string;
};

type LaunchLightlyContextState = {
  flags: Record<string, unknown>;
  connected: boolean;
  appId: string;
};

export const LaunchLightlyContextObject =
  createContext<LaunchLightlyContextState>({
    flags: {},
    connected: false,
    appId: "",
  });

const apiBaseUrl = "http://localhost:3002";

export function LaunchLightlyContext({
  children,
  appId,
}: PropsWithChildren<LaunchLightlyContextProps>) {
  const { connected } = useHeartbeat(apiBaseUrl);

  const flags = useMemo(() => {
    return { appId };
  }, []);

  const state: LaunchLightlyContextState = useMemo(
    () => ({
      flags,
      connected,
      appId,
    }),
    [flags, connected, appId],
  );

  return (
    <LaunchLightlyContextObject.Provider value={state}>
      {children}
    </LaunchLightlyContextObject.Provider>
  );
}
