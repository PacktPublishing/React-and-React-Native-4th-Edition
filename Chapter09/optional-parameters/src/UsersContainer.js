import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Users from "./Users";
import { fetchUsers } from "./api";

function UsersContainer() {
  const [users, setUsers] = useState([]);
  const params = useParams();
  const [search] = useSearchParams();

  useEffect(() => {
    const desc = params.desc === "desc" || !!search.get("desc");

    fetchUsers(desc).then((users) => {
      setUsers(users);
    });
  }, [params, search]);

  return <Users users={users} />;
}

export default UsersContainer;
