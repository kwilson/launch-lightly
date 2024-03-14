import { useContext } from "react";
import { LaunchLightlyContextObject } from "../contexts/LaunchLightlyContext";

export function useLaunchLightlyContext() {
  return useContext(LaunchLightlyContextObject);
}
