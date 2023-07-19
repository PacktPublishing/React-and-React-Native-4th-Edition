import * as React from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Button title="My Button" foo="bar">
    My Button
  </Button>
);

root.render(<Button />);
