import * as React from "react";
import * as ReactDOM from "react-dom";
import MyButtonContainer from "./MyButtonContainer";

function onClick() {
  this.setState({ disabled: true });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <section>
    <MyButtonContainer label="Text" />
    <MyButtonContainer
      label="My Button"
      icon="ui-icon-person"
      showLabel={false}
    />
    <MyButtonContainer label="Disable Me" onClick={onClick} />
  </section>
);
