import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MyComponent from "./MyComponent";

render(
  <Router>
    <Route exact path="/" component={MyComponent} />
  </Router>,
  document.getElementById("root")
);
