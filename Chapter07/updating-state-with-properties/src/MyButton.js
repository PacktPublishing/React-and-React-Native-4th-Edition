import * as React from "react";

function MyButton({ clicks, disabled, text, onClick }) {
  return (
    <section>
      <p>{clicks} clicks</p>
      <button disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </section>
  );
}

export default MyButton;
