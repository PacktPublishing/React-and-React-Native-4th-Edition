import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <MyComponent>
    <MyComponent.First />
    <MyComponent.Second />
  </MyComponent>
);
