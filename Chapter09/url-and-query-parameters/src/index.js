import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Echo from "./Echo";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/echo" element={<Echo />} />
      <Route path="/echo/:msg" element={<Echo />} />
    </Routes>
  </Router>
);
