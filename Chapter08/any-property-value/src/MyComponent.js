import * as React from "react";
import PropTypes from "prop-types";

function MyComponent({ label, value, max }) {
  return (
    <section>
      <h5>{label}</h5>
      <progress {...{ max, value }} />
    </section>
  );
}

MyComponent.propTypes = {
  label: PropTypes.any,
  value: PropTypes.any,
  max: PropTypes.any,
};

export default MyComponent;
