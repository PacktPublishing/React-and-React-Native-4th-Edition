import React, { Fragment } from "react";
import { Route, Redirect } from "react-router";
import First from "./First";
import Second from "./Second";

export default function One() {
  return (
    <Fragment>
      <Route exact path="/one" render={() => <Redirect to="/one/1" />} />
      <Route exact path="/one/1" component={First} />
      <Route exact path="/one/2" component={Second} />
    </Fragment>
  );
}
