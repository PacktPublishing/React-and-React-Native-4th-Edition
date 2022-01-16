import * as React from "react";
import { Route, Outlet } from "react-router-dom";
import Redirect from "../Redirect";
import First from "./First";
import Second from "./Second";

const routes = (
  <Route path="/one" element={<Outlet />}>
    <Route index element={<Redirect path="/one/1" />} />
    <Route path="/one/1" element={<First />} />
    <Route path="/one/2" element={<Second />} />
  </Route>
);

export default routes;
