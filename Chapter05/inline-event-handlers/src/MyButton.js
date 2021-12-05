import * as React from "react";

class MyButton extends React.Component {
  render() {
    return (
      <button onClick={(e) => console.log("clicked", e)}>
        {this.props.children}
      </button>
    );
  }
}

export default MyButton;
