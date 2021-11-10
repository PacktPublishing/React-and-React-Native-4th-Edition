import * as React from "react";

let unfilteredItems = new Array(25000)
  .fill(null)
  .map((v, i) => ({ id: i, name: `Item ${i}` }));

export default function PrioritizingUpdates() {
  let [filter, setFilter] = React.useState("");
  let [items, setItems] = React.useState([]);

  function onChange(e) {
    setFilter(e.target.value);
    React.startTransition(() => {
      setItems(
        e.target.value === ""
          ? []
          : unfilteredItems.filter(item => item.name.includes(e.target.value))
      );
    });
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Filter"
          value={filter}
          onChange={onChange}
        />
      </div>
      <div>
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
