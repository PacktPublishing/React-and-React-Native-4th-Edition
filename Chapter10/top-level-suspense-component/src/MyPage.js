import * as React from "react";

const MyFeature = React.lazy(() => import("./MyFeature"));

function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <MyFeature />
    </>
  );
}

export default MyPage;
