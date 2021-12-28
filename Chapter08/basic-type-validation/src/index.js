import * as React from "react";
import * as ReactDOM from "react-dom";
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

const invalidProps = {
  myString: 100,
  myNumber: "My String",
  myBool: () => "My Reaturn Value",
  myFunc: true,
  myArray: { myProp: "My Prop" },
  myObject: ["One", "Two", "Three"],
};

function render(props) {
  root.render(<MyComponent {...props} />);
}

render(validProps);
render(invalidProps);
