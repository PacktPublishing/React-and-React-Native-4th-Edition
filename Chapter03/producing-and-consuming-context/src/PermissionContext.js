import * as React from "react";

const { Provider, Consumer } = React.createContext("permissions");

class PermissionProvider extends React.Component {
  state = {
    first: true,
    second: false,
    third: true,
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

const PermissionConsumer = ({ name, children }) => (
  <Consumer>{(value) => value[name] && children}</Consumer>
);

export { PermissionProvider, PermissionConsumer };
