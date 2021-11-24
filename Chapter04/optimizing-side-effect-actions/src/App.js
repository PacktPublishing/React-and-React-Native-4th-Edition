import * as React from "react";
import User from "./User";

const ShowHideUser = ({ show }) => (show ? <User /> : null);

function App() {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? "Hide User" : "Show User"}
      </button>
      <ShowHideUser show={show} />
    </>
  );
}

export default App;
