import * as React from "react";

const MyFeature = React.lazy(() =>
  Promise.all([
    import("./MyFeature"),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }),
  ]).then(([m]) => m)
);

function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <MyFeature />
    </>
  );
}

export default MyPage;
