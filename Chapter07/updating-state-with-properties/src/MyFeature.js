import * as React from "react";
import MyButton from "./MyButton";

class MyFeature extends React.Component {
  state = {
    clicks: 0,
    disabled: false,
    text: "",
  };

  onClick = () => {
    this.setState((state) => ({
      ...state,
      clicks: state.clicks + 1,
    }));
  };

  render() {
    return <MyButton onClick={this.onClick} {...this.state} />;
  }

  static getDerivedStateFromProps({ disabled, text }, state) {
    return { ...state, disabled, text };
  }
}

MyFeature.defaultProps = {
  text: "A Button",
};

export default MyFeature;
