import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <section>
    <MyComponent level={10} user={{ name: "Name", age: 32 }} />
    <MyComponent user={{ name: "Name", age: 32, online: false }} />
    <MyComponent level={11} user={{ name: "Name", age: "32" }} />
  </section>
);
