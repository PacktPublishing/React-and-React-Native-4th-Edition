import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyList from "./MyList";

const items = [
  { id: 0, name: "First" },
  { id: 1, name: "Second" },
  { id: 2, name: "Third" },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyList items={items} />);
