import * as React from "react";
import * as ReactDOM from "react-dom";
import MyComponent from "./MyComponent";
import MyUser from "./MyUser";

const users = [
  new MyUser("First1", "Last1"),
  new MyUser("First2", "Last2"),
  new MyUser("First3", "Last3"),
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <section>
    <MyComponent myDate={new Date()} myCount={0} myUsers={users} />
    <MyComponent
      myDate="6/9/2016"
      myCount={false}
      myUsers={[1, 2, 3]}
    />
  </section>
);
