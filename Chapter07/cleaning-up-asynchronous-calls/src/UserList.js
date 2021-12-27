import * as React from "react";

const ErrorMessage = ({ error }) =>
  error ? <strong>{error}</strong> : null;
const LoadingMessage = ({ loading }) =>
  loading ? <em>{loading}</em> : null;
const CancelLink = ({ loading, onClick }) =>
  loading ? (
    <a href="#cancel" onClick={onClick}>
      Cancel
    </a>
  ) : null;

function UserList({ error, loading, users, onClickCancel }) {
  return (
    <section>
      <ErrorMessage error={error} />
      <LoadingMessage loading={loading} />
      <ul>
        {users.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
      <CancelLink loading={loading} onClick={onClickCancel} />
    </section>
  );
}
export default UserList;
