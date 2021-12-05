import * as React from "react";

class MyButton extends React.Component {
  onClick() {
    console.log("clicked");
  }

  render() {
    return (
      <button onClick={this.onClick}>{this.props.children}</button>
    );
  }
}

export default MyButton;
