import * as React from "react";

function MyComponent({ myArray, myNumber }) {
  return (
    <section>
      <ul>
        {myArray.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <p>{myNumber}</p>
    </section>
  );
}

MyComponent.propTypes = {
  myArray: (props, name, component) =>
    Array.isArray(props[name]) && props[name].length
      ? null
      : new Error(`${component}.${name}: expecting non-empty array`),

  myNumber: (props, name, component) =>
    Number.isFinite(props[name]) &&
    props[name] > 0 &&
    props[name] < 100
      ? null
      : new Error(
          `${component}.${name}: expecting number between 1 and 99`
        ),
};

export default MyComponent;
