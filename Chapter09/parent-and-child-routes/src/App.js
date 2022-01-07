import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import UsersHeader from "./users/UsersHeader";
import UsersMain from "./users/UsersMain";
import GroupsHeader from "./groups/GroupsHeader";
import GroupsMain from "./groups/GroupsMain";

export default function App() {
  return (
    <Router>
      <section>
        <nav>
          <NavLink
            exact
            to="/"
            style={{ padding: "0 10px" }}
            activeStyle={{ fontWeight: "bold" }}
          >
            Home
          </NavLink>
          <NavLink
            exact
            to="/users"
            style={{ padding: "0 10px" }}
            activeStyle={{ fontWeight: "bold" }}
          >
            Users
          </NavLink>
          <NavLink
            exact
            to="/groups"
            style={{ padding: "0 10px" }}
            activeStyle={{ fontWeight: "bold" }}
          >
            Groups
          </NavLink>
        </nav>
        <header>
          <Route exact path="/" render={() => <h1>Home</h1>} />
          <Route exact path="/users" component={UsersHeader} />
          <Route exact path="/groups" component={GroupsHeader} />
        </header>
        <main>
          <Route exact path="/users" component={UsersMain} />
          <Route exact path="/groups" component={GroupsMain} />
        </main>
      </section>
    </Router>
  );
}
