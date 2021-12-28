import React from "react";

const LoadingMessage = ({ loading }) =>
  loading ? <em>{loading}</em> : null;

function UserList({ error, loading, users }) {
  return (
    <section>
      <LoadingMessage loading={loading} />
      <ul>
        {users.map((user) => (
          <li key={user.id.toUpperCase()}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default UserList;
