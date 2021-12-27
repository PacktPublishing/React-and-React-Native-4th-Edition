import * as React from "react";
import * as ReactDOM from "react-dom";
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

myUser.current.setState({
  first: "First2",
  last: "Last2",
});
