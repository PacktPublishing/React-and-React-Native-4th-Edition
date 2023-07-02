import * as React from "react";
import * as ReactDOM from "react-dom/client";
import MyUser from "./MyUser";

const root = ReactDOM.createRoot(document.getElementById("root"));
const myUser = React.createRef();

ReactDOM.flushSync(() => {
  root.render(<MyUser ref={myUser} />);
});

myUser.current.setState({
  modified: new Date(),
  first: "First1",
  last: "Last1",
});

// The setTimeout() is used here to avoid batched state updates, for demonstration
// purposes. In a real app, the setState() call would happen in response to some user
// event or the arrival of new data from the network, in which case batched state
// updates wouldn't matter but we would still want to check the modified value
// to see if it makes sense to re-render the component.
setTimeout(() => {
  myUser.current.setState({
    first: "First2",
    last: "Last2",
  });
}, 1000);
