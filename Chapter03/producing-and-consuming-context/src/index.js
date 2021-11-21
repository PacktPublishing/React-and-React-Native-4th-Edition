import * as React from "react";
import * as ReactDOM from "react-dom";
import { PermissionProvider } from "./PermissionContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <PermissionProvider>
    <App />
  </PermissionProvider>
);
