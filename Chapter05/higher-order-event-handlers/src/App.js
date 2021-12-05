import * as React from "react";

class App extends React.Component {
  state = {
    first: 0,
    second: 0,
    third: 0,
  };

  onClick = (name) => () => {
    this.setState((state) => ({
      ...state,
      [name]: state[name] + 1,
    }));
  };

  render() {
    const { first, second, third } = this.state;

    return (
      <>
        <button onClick={this.onClick("first")}>First {first}</button>
        <button onClick={this.onClick("second")}>
          Second {second}
        </button>
        <button onClick={this.onClick("third")}>Third {third}</button>
      </>
    );
  }
}

export default App;
