import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyButton from "./MyButton";

const root = ReactDOM.createRoot(document.getElementById("root"));

function render({ first, second }) {
  root.render(
    <main>
      <MyButton text={first.text} disabled={first.disabled} />
      <MyButton text={second.text} disabled={second.disabled} />
    </main>
  );
}

render({
  first: {
    text: "First Button",
    disabled: false,
  },
  second: {
    text: "Second Button",
    disabled: true,
  },
});
