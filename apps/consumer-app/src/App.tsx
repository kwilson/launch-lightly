import {
  LaunchLightlyContext,
  useLaunchLightlyContext,
} from "@launchlightly/react";
import "./App.css";
import { useMemo, useState } from "react";
import { z } from "zod";

const flagSchema = z.object({
  "show-copilot": z.boolean().default(false),
});

function FlaggedContext() {
  const { flags, connected, projectId } = useLaunchLightlyContext();
  const parsedFlags = useMemo(() => flagSchema.parse(flags), [flags]);

  return (
    <>
      <h1>My Dummy App</h1>

      <div className="features">
        <button type="button">Do Some Stuff</button>
        <button type="button">Do Some Other Stuff</button>
        {parsedFlags["show-copilot"] && (
          <button type="button">Launch Copilot</button>
        )}
      </div>

      <hr />

      <pre>
        {JSON.stringify({ flags, parsedFlags, connected, projectId }, null, 2)}
      </pre>
    </>
  );
}

function App() {
  const [userFieldId, setUserFieldId] = useState("");
  const [userId, setUserId] = useState("");

  const isLoggedIn = Boolean(userId);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    setUserId(userFieldId);
    setUserFieldId("");
  };

  const onLogOut = () => setUserId("");

  return (
    <LaunchLightlyContext projectId="my-first-project" userId={userId}>
      {isLoggedIn && (
        <div className="login-bar">
          <p>
            Logged in as <b>{userId}</b>
          </p>
          <button onClick={onLogOut} type="button">
            Log Out
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <form className="userform" onSubmit={onSubmit}>
          <label>
            <div>UserId</div>
            <input
              type="text"
              value={userFieldId}
              onChange={(e) => setUserFieldId(e.target.value)}
              required
            />
          </label>

          <div>
            <button type="submit">Log In</button>
          </div>
        </form>
      )}

      {isLoggedIn && (
        <div style={{ textAlign: "left" }}>
          <FlaggedContext />
        </div>
      )}
    </LaunchLightlyContext>
  );
}

export default App;
