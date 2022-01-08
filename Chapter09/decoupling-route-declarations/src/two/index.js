import React, { Fragment } from "react";
import { Route, Redirect } from "react-router";
import First from "./First";
import Second from "./Second";

export default function Two() {
  return (
    <Fragment>
      <Route exact path="/two" render={() => <Redirect to="/two/1" />} />
      <Route exact path="/two/1" component={First} />
      <Route exact path="/two/2" component={Second} />
    </Fragment>
  );
}
