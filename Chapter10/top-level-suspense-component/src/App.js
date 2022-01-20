import * as React from "react";
import MyPage from "./MyPage";

function App() {
  return (
    <React.Suspense fallback={"loading..."}>
      <MyPage />
    </React.Suspense>
  );
}

export default App;
