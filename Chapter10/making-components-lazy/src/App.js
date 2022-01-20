import * as React from "react";

const MyComponent = React.lazy(() => import("./MyComponent"));

function App() {
  return (
    <React.Suspense fallback={"loading..."}>
      <MyComponent />
    </React.Suspense>
  );
}

export default App;
