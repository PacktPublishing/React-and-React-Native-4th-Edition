import React from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/button";
import "jquery-ui/themes/base/all.css";

class MyButton extends React.Component {
  componentDidMount() {
    $(this.button).button(this.props);
  }

  componentDidUpdate() {
    $(this.button).button("option", this.props);
  }

  render() {
    return (
      <button
        onClick={this.props.onClick}
        ref={(button) => {
          this.button = button;
        }}
      />
    );
  }
}

export default MyButton;
