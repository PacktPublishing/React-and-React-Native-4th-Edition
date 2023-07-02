import * as React from "react";
import * as ReactDOM from "react-dom/client";
import UserListContainer from "./UserListContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<UserListContainer loading="playing the waiting game..." />);
