import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyFeature from "./MyFeature";

let disabled = true;
const root = ReactDOM.createRoot(document.getElementById("root"));

function render() {
  disabled = !disabled;

  root.render(<MyFeature {...{ disabled }} />);
}

setInterval(render, 3000);
render();
