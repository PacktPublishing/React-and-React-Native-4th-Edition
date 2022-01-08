import React, { useState, useEffect } from "react";
import { fetchItems } from "./api";
import List from "./List";

function mapItems(items) {
  return items.map((value, i) => ({ key: i.toString(), value }));
}

export default function ListContainer() {
  const [asc, setAsc] = useState(true);
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchItems(filter, asc)
      .then((resp) => resp.json())
      .then(({ items }) => {
        setData(mapItems(items));
      });
  }, []);

  return (
    <List
      data={data}
      asc={asc}
      onFilter={(text) => {
        fetchItems(text, asc)
          .then((resp) => resp.json())
          .then(({ items }) => {
            setFilter(text);
            setData(mapItems(items));
          });
      }}
      onSort={() => {
        fetchItems(filter, !asc)
          .then((resp) => resp.json())
          .then(({ items }) => {
            setAsc(!asc);
            setData(mapItems(items));
          });
      }}
    />
  );
}
