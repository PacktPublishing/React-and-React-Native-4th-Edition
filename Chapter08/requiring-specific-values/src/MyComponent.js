import * as React from "react";
import PropTypes from "prop-types";

const levels = new Array(10).fill(null).map((v, i) => i + 1);
const userShape = {
  name: PropTypes.string,
  age: PropTypes.number,
};

function MyComponent({ level, user }) {
  return (
    <section>
      <p>{level}</p>
      <p>{user.name}</p>
      <p>{user.age}</p>
    </section>
  );
}

MyComponent.propTypes = {
  level: PropTypes.oneOf(levels),
  user: PropTypes.shape(userShape),
};

export default MyComponent;
