import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";

import FirstHeader from "./first/FirstHeader";
import FirstContent from "./first/FirstContent";
import SecondHeader from "./second/SecondHeader";
import SecondContent from "./second/SecondContent";

function Layout() {
  return (
    <section>
      <Outlet />
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <>
              <h1>App</h1>
              <ul>
                <li>
                  <Link to="first">First</Link>
                </li>
                <li>
                  <Link to="second">Second</Link>
                </li>
              </ul>
            </>
          }
        />
        <Route
          path="/first"
          element={
            <>
              <header>
                <FirstHeader />
              </header>
              <main>
                <FirstContent />
              </main>
            </>
          }
        />
        <Route
          path="/second"
          element={
            <>
              <header>
                <SecondHeader />
              </header>
              <main>
                <SecondContent />
              </main>
            </>
          }
        />
      </Route>
    </Routes>
  );
}
