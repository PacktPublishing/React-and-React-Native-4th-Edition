import * as React from "react";

let unfilteredItems = new Array(25000)
  .fill(null)
  .map((v, i) => ({ id: i, name: `Item ${i}` }));

function filterItems(filter) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(unfilteredItems.filter(item => item.name.includes(filter)));
    }, 1000);
  });
}

export default function AsyncUpdates() {
  let [loading, setLoading] = React.useState(false);
  let [filter, setFilter] = React.useState("");
  let [items, setItems] = React.useState([]);

  async function onChange(e) {
    setLoading(true);
    setFilter(e.target.value);

    React.startTransition(async () => {
      setItems(e.target.value === "" ? [] : await filterItems(e.target.value));
      setLoading(false);
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
        {loading && <em>loading...</em>}
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
