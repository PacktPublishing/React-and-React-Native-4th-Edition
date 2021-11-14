import * as React from "react";

class MyButton extends React.Component {
  render() {
    return <button>{this.props.children}</button>;
  }
}

export default MyButton;
