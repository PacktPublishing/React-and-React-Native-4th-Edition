import * as React from "react";

function App() {
  const [name, setName] = React.useState("Adam");
  const [age, setAge] = React.useState(35);

  return (
    <>
      <section>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>My name is {name}</p>
      </section>
      <section>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <p>My age is {age}</p>
      </section>
    </>
  );
}

export default App;
