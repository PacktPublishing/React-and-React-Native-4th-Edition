import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersContainer from "./UsersContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/users">
        <Route path=":desc" element={<UsersContainer />} />
        <Route path="" element={<UsersContainer />} />
      </Route>
    </Routes>
  </Router>
);
