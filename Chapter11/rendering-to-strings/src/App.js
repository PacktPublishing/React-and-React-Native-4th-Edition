import React from "react";
import PropTypes from "prop-types";

export default function App({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

App.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired
};
