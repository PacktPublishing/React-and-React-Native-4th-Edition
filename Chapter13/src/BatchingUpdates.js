import * as React from "react";

export default function BatchingUpdates() {
  let [value, setValue] = React.useState("loading...");

  function onStart() {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        setValue(`value ${i + 1}`);
      }
    }, 1);
  }

  return (
    <div>
      <p>
        Value: <em>{value}</em>
      </p>
      <button onClick={onStart}>Start</button>
    </div>
  );
}
