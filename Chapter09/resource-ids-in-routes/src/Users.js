import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Users({ users }) {
  return (
    <ul>
      {users.map((user, id) => (
        <li key={id}>
          <Link to={`/users/${id}`}>{user.first}</Link>
        </li>
      ))}
    </ul>
  );
}

Users.propTypes = {
  users: PropTypes.array
};
