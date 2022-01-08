import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UsersContainer from "./UsersContainer";
import UserContainer from "./UserContainer";

export default function App() {
  return (
    <Router>
      <Fragment>
        <Route exact path="/" component={UsersContainer} />
        <Route path="/users/:id" component={UserContainer} />
      </Fragment>
    </Router>
  );
}
