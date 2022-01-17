import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersContainer from "./UsersContainer";
import UserContainer from "./UserContainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersContainer />} />
        <Route path="/users/:id" element={<UserContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
