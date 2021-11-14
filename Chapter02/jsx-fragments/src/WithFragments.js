import * as React from "react";

class WithFragments extends React.Component {
  render() {
    return (
      <>
        <h1>With Fragments</h1>
        <p>Doesn't have any unused DOM elements.</p>
      </>
    );
  }
}

export default WithFragments;
