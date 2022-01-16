import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import User from "./User";
import { fetchUser } from "./api";

function UserContainer() {
  const params = useParams();
  const [error, setError] = useState();
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [age, setAge] = useState();

  useEffect(() => {
    fetchUser(Number(params.id)).then(
      (user) => {
        setError(null);
        setFirst(user.first);
        setLast(user.last);
        setAge(user.age);
      },
      (error) => {
        setError(error);
        setFirst(null);
        setLast(null);
        setAge(null);
      }
    );
  }, [params.id]);

  return <User {...{ error, first, last, age }} />;
}

export default UserContainer;
