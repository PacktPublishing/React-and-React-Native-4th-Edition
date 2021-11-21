import * as React from "react";

const MyButton = ({ disabled, text }) => (
  <button disabled={disabled}>{text}</button>
);

MyButton.defaultProps = {
  text: "My Button",
  disabled: false,
};

export default MyButton;
