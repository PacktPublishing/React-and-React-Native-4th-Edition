import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import { FadeLoader } from "react-spinners";

const First = React.lazy(() =>
  Promise.all([
    import("./First"),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }),
  ]).then(([m]) => m)
);

const Second = React.lazy(() =>
  Promise.all([
    import("./Second"),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }),
  ]).then(([m]) => m)
);

function Layout() {
  return (
    <section>
      <nav>
        <p>
          <Link to="first">First</Link>
        </p>
        <p>
          <Link to="second">Second</Link>
        </p>
      </nav>
      <section>
        <React.Suspense
          fallback={<FadeLoader color={"lightblue"} size={150} />}
        >
          <Outlet />
        </React.Suspense>
      </section>
    </section>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/first" element={<First />} />
          <Route path="/second" element={<Second />} />
        </Route>
      </Routes>
    </Router>
  );
}
