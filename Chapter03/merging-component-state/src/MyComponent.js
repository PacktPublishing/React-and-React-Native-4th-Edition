import * as React from "react";

class MyComponent extends React.Component {
  state = {
    first: "loading...",
    second: "loading...",
    third: "loading...",
    fourth: "loading...",
    doneMessage: "finished!",
  };

  constructor() {
    super();

    setTimeout(() => {
      this.setState({ first: "done!" });
    }, 1000);

    setTimeout(() => {
      this.setState({ second: "done!" });
    }, 2000);

    setTimeout(() => {
      this.setState({ third: "done!" });
    }, 3000);

    setTimeout(() => {
      this.setState((state) => ({
        ...state,
        fourth: state.doneMessage,
      }));
    }, 4000);
  }

  render() {
    return (
      <ul>
        {Object.keys(this.state)
          .filter((key) => key !== "doneMessage")
          .map((key) => (
            <li key={key}>
              <strong>{key}: </strong>
              {this.state[key]}
            </li>
          ))}
      </ul>
    );
  }
}

export default MyComponent;
