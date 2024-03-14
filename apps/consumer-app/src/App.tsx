import {
  LaunchLightlyContext,
  useLaunchLightlyContext,
} from "@launchlightly/react";
import "./App.css";

function FlaggedContext() {
  const { flags, connected, appId } = useLaunchLightlyContext();

  return <pre>{JSON.stringify({ flags, connected, appId }, null, 2)}</pre>;
}

function App() {
  return (
    <LaunchLightlyContext projectId="my-first-project" userId="kevin">
      <div style={{ textAlign: "left" }}>
        <FlaggedContext />
      </div>
    </LaunchLightlyContext>
  );
}

export default App;
