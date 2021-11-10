import * as React from "react";
import AsyncUpdates from "./AsyncUpdates";
import BatchingUpdates from "./BatchingUpdates";
import PrioritizingUpdates from "./PrioritizingUpdates";

function resetState(state) {
  return Object.fromEntries(Object.keys(state).map(key => [key, false]));
}

export default function App() {
  let [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "batchingUpdates":
          return { ...resetState(state), batchingUpdates: true };
        case "prioritizingUpdates":
          return { ...resetState(state), prioritizingUpdates: true };
        case "asyncUpdates":
          return { ...resetState(state), asyncUpdates: true };
        default:
          throw new Error(`Invalid action: ${action.type}`);
      }
    },
    { batchingUpdates: true, prioritizingUpdates: false, asyncUpdates: false }
  );

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: 20
        }}
      >
        <button
          disabled={state.batchingUpdates}
          onClick={() => dispatch({ type: "batchingUpdates" })}
        >
          Batching Updates
        </button>
        <button
          disabled={state.prioritizingUpdates}
          onClick={() => dispatch({ type: "prioritizingUpdates" })}
        >
          Prioritizing Updates
        </button>
        <button
          disabled={state.asyncUpdates}
          onClick={() => dispatch({ type: "asyncUpdates" })}
        >
          Async Updates
        </button>
      </nav>
      <main style={{ margin: 20 }}>
        {state.batchingUpdates && <BatchingUpdates />}
        {state.prioritizingUpdates && <PrioritizingUpdates />}
        {state.asyncUpdates && <AsyncUpdates />}
      </main>
    </div>
  );
}
