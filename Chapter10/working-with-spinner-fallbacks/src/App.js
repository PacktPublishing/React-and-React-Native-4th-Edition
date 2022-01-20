import * as React from "react";
import { FadeLoader } from "react-spinners";
import MyPage from "./MyPage";

function App() {
  return (
    <React.Suspense fallback={<FadeLoader color={"lightblue"} size={150} />}>
      <MyPage />
    </React.Suspense>
  );
}

export default App;
