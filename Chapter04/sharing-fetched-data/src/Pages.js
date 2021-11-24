import * as React from "react";
import { UserContext } from "./UserContext";

function Username() {
  const user = React.useContext(UserContext);
  return (
    <p>
      Logged in as <strong>{user.name}</strong>
    </p>
  );
}

export function Page1() {
  return (
    <>
      <h1>Page 1</h1>
      <Username />
    </>
  );
}

export function Page2() {
  return (
    <>
      <h1>Page 2</h1>
      <Username />
    </>
  );
}

export function Page3() {
  return (
    <>
      <h1>Page 3</h1>
      <Username />
    </>
  );
}
