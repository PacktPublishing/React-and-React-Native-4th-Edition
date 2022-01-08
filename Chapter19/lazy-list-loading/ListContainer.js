import React, { useState, useEffect } from "react";
import * as api from "./api";
import List from "./List";

export default function ListContainer() {
  const [data, setData] = useState([]);

  function fetchItems() {
    return api
      .fetchItems()
      .then((resp) => resp.json())
      .then(({ items }) => {
        setData([
          ...data,
          ...items.map((value) => ({
            key: value,
            value,
          })),
        ]);
      });
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return <List data={data} fetchItems={fetchItems} />;
}
