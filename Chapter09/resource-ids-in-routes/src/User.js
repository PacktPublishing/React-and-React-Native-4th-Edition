import React from "react";
import PropTypes from "prop-types";

const Error = ({ error }) =>
  error ? (
    <p>
      <strong>{error}</strong>
    </p>
  ) : null;
const Text = ({ children }) => (children ? <p>{children}</p> : null);

export default function User({ error, first, last, age }) {
  return (
    <section>
      <Error error={error} />
      <Text>{first}</Text>
      <Text>{last}</Text>
      <Text>{age}</Text>
    </section>
  );
}

User.propTypes = {
  error: PropTypes.string,
  first: PropTypes.string,
  last: PropTypes.string,
  age: PropTypes.number
};
