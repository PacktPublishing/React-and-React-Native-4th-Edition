import * as React from "react";
import reverse from "./reverse";

class MyList extends React.Component {
  state = {
    items: ["Angular", "Ember", "React"],
  };

  onReverseClick = reverse.bind(this);

  render() {
    const {
      state: { items },
      onReverseClick,
    } = this;

    return (
      <section>
        <button onClick={onReverseClick}>Reverse</button>
        <ul>
          {items.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </section>
    );
  }
}

export default MyList;
