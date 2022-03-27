import React, { useState, useEffect } from "react";
import * as api from "./api";
import List from "./List";

export default function ListContainer() {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  function refreshItems() {
    setIsRefreshing(true);
    return api
      .fetchItems({ refresh: true })
      .then((resp) => resp.json())
      .then(({ items }) => {
        setData(
          items.map((value) => ({
            key: value,
            value,
          }))
        );
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <List
      data={data}
      fetchItems={fetchItems}
      refreshItems={refreshItems}
      isRefreshing={isRefreshing}
    />
  );
}
