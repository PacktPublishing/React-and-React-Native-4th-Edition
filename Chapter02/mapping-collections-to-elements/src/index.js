import * as React from "react";
import * as ReactDOM from "react-dom";

const array = ["First", "Second", "Third"];

const object = {
  first: 1,
  second: 2,
  third: 3,
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <section>
    <h1>Array</h1>
    <ul>
      {array.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>

    <h1>Object</h1>
    <ul>
      {Object.keys(object).map((i) => (
        <li key={i}>
          <strong>{i}: </strong>
          {object[i]}
        </li>
      ))}
    </ul>
  </section>
);
