import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Users from "./Users";
import { fetchUsers } from "./api";

export default function UsersContainer({
  match: { params },
  location: { search }
}) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const desc =
      params.desc === "desc" || !!new URLSearchParams(search).get("desc");

    fetchUsers(desc).then(users => {
      setUsers(users);
    });
  }, [params, search]);

  return <Users users={users} />;
}

UsersContainer.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
