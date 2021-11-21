import * as React from "react";
import * as ReactDOM from "react-dom";
import MyButton from "./MyButton";

const root = ReactDOM.createRoot(document.getElementById("root"));

function render({ second }) {
  root.render(
    <main>
      <MyButton />
      <MyButton text={second.text} disabled={second.disabled} />
    </main>
  );
}

render({
  second: {
    text: "Second Button",
    disabled: true,
  },
});
