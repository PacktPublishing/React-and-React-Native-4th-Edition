import * as React from "react";
import MyList from "./MyList";

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["First", "Second", "Third"]);
    }, 2000);
  });
}

class MyContainer extends React.Component {
  state = { items: [] };

  componentDidMount() {
    fetchData().then((items) => this.setState({ items }));
  }

  render() {
    return <MyList {...this.state} />;
  }
}

export default MyContainer;
