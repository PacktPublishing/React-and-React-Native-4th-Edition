import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import oneRoutes from "./one";
import Redirect from "./Redirect";
import twoRoutes from "./two";

export default () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Redirect path="/one" />} />
        {oneRoutes}
        {twoRoutes}
      </Route>
    </Routes>
  </Router>
);
