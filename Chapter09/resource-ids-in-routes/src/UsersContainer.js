import React, { useState, useEffect } from "react";
import Users from "./Users";
import { fetchUsers } from "./api";

function UsersContainer() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return <Users users={users} />;
}

export default UsersContainer;
