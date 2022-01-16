import * as React from "react";
import PropTypes from "prop-types";

function Users({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user}>{user}</li>
      ))}
    </ul>
  );
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
};

export default Users;
