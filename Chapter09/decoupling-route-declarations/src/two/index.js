import * as React from "react";
import { Route } from "react-router-dom";
import Redirect from "../Redirect";
import First from "./First";
import Second from "./Second";

const routes = (
  <Route path="/two">
    <Route index element={<Redirect path="/two/1" />} />
    <Route path="/two/1" element={<First />} />
    <Route path="/two/2" element={<Second />} />
  </Route>
);

export default routes;
