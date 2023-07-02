import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <section>
    <MyComponent label="Regular Values" max={20} value={10} />
    <MyComponent label="String Values" max="20" value="10" />
    <MyComponent label={Number.MAX_SAFE_INTEGER} max={new Date()} value="10" />
  </section>
);
