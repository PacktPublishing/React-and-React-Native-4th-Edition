import * as React from "react";
import * as ReactDOM from "react-dom";

class MyComponent extends React.Component {
  render() {
    return (
      <section>
        <h1>My Component</h1>
        <p>Content in my component...</p>
      </section>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyComponent />);
