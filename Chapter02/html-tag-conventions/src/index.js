import * as React from "react";
import * as ReactDOM from "react-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <button title="My Button" foo="bar">
    My Button
  </button>
);

root.render(<Button />);
