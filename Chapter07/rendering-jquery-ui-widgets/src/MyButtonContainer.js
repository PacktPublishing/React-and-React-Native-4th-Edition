import React from "react";
import MyButton from "./MyButton";

class MyButtonContainer extends React.Component {
  componentDidMount() {
    this.setState({
      ...this.props,
      onClick: this.props.onClick.bind(this),
    });
  }

  render() {
    return <MyButton {...this.state} />;
  }
}

MyButtonContainer.defaultProps = {
  onClick: () => {},
};

export default MyButtonContainer;
