import React from "react";
import { Router, Route, browserHistory } from "react-router";
import App from "./App";
import UsersHeader from "./users/UsersHeader";
import UsersMain from "./users/UsersMain";
import GroupsHeader from "./groups/GroupsHeader";
import GroupsMain from "./groups/GroupsMain";

const users = {
  path: "users",
  components: {
    header: UsersHeader,
    main: UsersMain
  }
};

const groups = {
  path: "groups",
  components: {
    header: GroupsHeader,
    main: GroupsMain
  }
};

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route {...users} />
      <Route {...groups} />
    </Route>
  </Router>
);
