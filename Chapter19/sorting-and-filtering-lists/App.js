import React from "react";
import { View } from "react-native";
import styles from "./styles";
import ListContainer from "./ListContainer";

export default function App() {
  return (
    <View style={styles.container}>
      <ListContainer />
    </View>
  );
}
