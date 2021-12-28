import * as React from "react";
import * as ReactDOM from "react-dom";
import MyComponent from "./MyComponent";

const myHeader = <h1>My Header</h1>;
const myContent = <p>My Content</p>;
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <section>
    <MyComponent {...{ myHeader, myContent }} />
    <MyComponent myHeader="My Header" {...{ myContent }} />
    <MyComponent {...{ myHeader }} myContent="My Content" />
    <MyComponent
      {...{ myHeader }}
      myContent={[myContent, myContent, myContent]}
    />
  </section>
);
