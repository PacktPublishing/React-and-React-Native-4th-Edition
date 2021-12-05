import * as React from "react";

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

class MyButton extends React.Component {
  onClick(e) {
    const style = e.currentTarget.style;

    console.log("clicked", style);

    fetchData().then(() => {
      console.log("callback", style);
    });
  }

  render() {
    return (
      <button onClick={this.onClick}>{this.props.children}</button>
    );
  }
}

export default MyButton;
