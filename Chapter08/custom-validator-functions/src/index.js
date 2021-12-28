import * as React from "react";
import * as ReactDOM from "react-dom";
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <section>
    <MyComponent
      myArray={["first", "second", "third"]}
      myNumber={99}
    />
    <MyComponent myArray={[]} myNumber={100} />
  </section>
);
