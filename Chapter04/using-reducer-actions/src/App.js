import * as React from "react";

function reducer(state, action) {
  switch (action.type) {
    case "changeName":
      return { ...state, name: action.value };
    case "changeAge":
      return { ...state, age: action.value };
    default:
      throw new Error(`${action.type} is not a valid action`);
  }
}

function App() {
  const [{ name, age }, dispatch] = React.useReducer(reducer, {
    name: "",
    age: "",
  });

  return (
    <>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          dispatch({ type: "changeName", value: e.target.value })
        }
      />
      <p>Name: {name}</p>
      <input
        placeholder="Age"
        type="number"
        value={age}
        onChange={(e) =>
          dispatch({ type: "changeAge", value: e.target.value })
        }
      />
      <p>Age: {age}</p>
    </>
  );
}

export default App;
