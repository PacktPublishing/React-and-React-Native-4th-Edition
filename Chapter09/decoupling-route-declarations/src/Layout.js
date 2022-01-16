import * as React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default Layout;
