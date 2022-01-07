import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UsersContainer from "./UsersContainer";

export default (
  <Router>
    <Route path="/users(/:desc)" component={UsersContainer} />
  </Router>
);
