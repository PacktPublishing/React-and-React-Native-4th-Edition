import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));

const validProps = {
  myString: "My String",
  myNumber: 100,
  myBool: true,
  myFunc: () => "My Return Value",
  myArray: ["One", "Two", "Three"],
  myObject: { myProp: "My Prop" },
};

const missingProp = {
  myString: "My String",
  myNumber: 100,
  myBool: true,
  myFunc: () => "My Return Value",
  myArray: ["One", "Two", "Three"],
};

function render(props) {
  root.render(<MyComponent {...props} />);
}

render(validProps);
render(missingProp);
