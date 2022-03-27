import React from "react";
import PropTypes from "prop-types";
import { Text, FlatList } from "react-native";
import styles from "./styles";

export default function List({ data, fetchItems, refreshItems, isRefreshing }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Text style={styles.item}>{item.value}</Text>}
      onEndReached={fetchItems}
      onRefresh={refreshItems}
      refreshing={isRefreshing}
    />
  );
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  fetchItems: PropTypes.func.isRequired,
  refreshItems: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
};
