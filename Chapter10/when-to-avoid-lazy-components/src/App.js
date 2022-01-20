import * as React from "react";

const First = React.lazy(() => import("./First"));
const Second = React.lazy(() => import("./Second"));

function ShowComponent({ name }) {
  switch (name) {
    case "first":
      return <First />;
    case "second":
      return <Second />;
    default:
      return null;
  }
}

function App() {
  const [component, setComponent] = React.useState("");

  return (
    <>
      <label>
        Load Component:{" "}
        <select
          value={component}
          onChange={(e) => setComponent(e.target.value)}
        >
          <option value="">None</option>
          <option value="first">First</option>
          <option value="second">Second</option>
        </select>
      </label>
      <React.Suspense fallback="loading...">
        <ShowComponent name={component} />
      </React.Suspense>
    </>
  );
}

export default App;
