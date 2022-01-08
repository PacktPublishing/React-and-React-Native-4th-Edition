import React from "react";
import PropTypes from "prop-types";

export default function Users({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user}>{user}</li>
      ))}
    </ul>
  );
}

Users.propTypes = {
  users: PropTypes.array.isRequired
};
