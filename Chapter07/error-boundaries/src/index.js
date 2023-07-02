import * as React from "react";
import * as ReactDOM from "react-dom/client";
import ErrorBoundary from "./ErrorBoundary";
import UserListContainer from "./UserListContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <UserListContainer />
  </ErrorBoundary>
);
