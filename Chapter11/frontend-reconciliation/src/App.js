import React, { useState } from "react";

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <section>
      <header>
        <h1>Hydrating The Client</h1>
      </header>
      <main>
        <p>Clicks {clicks}</p>
        <button onClick={() => setClicks(clicks + 1)}>Click Me</button>
      </main>
    </section>
  );
}
