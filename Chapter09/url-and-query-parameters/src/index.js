import React, { Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import Echo from "./Echo";

render(
  <Router>
    <Fragment>
      <Route exact path="/" render={() => <App />} />
      <Route
        exact
        path="/echo/:msg?"
        render={() => (
          <App>
            <Echo />
          </App>
        )}
      />
    </Fragment>
  </Router>,
  document.getElementById("root")
);
