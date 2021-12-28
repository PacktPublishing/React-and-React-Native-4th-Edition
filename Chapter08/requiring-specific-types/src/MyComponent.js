import * as React from "react";
import PropTypes from "prop-types";
import MyUser from "./MyUser";

function MyComponent({ myDate, myCount, myUsers }) {
  return (
    <section>
      <p>{myDate.toLocaleString()}</p>
      <p>{myCount}</p>
      <ul>
        {myUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
}

MyComponent.propTypes = {
  myDate: PropTypes.instanceOf(Date),
  myCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  myUsers: PropTypes.arrayOf(PropTypes.instanceOf(MyUser)),
};

export default MyComponent;
