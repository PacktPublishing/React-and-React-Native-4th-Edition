import React from "react";
import { View, StatusBar } from "react-native";
import styles from "./styles";
import Box from "./Box";

const boxes = new Array(10).fill(null).map((v, i) => i + 1);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />
      {boxes.map((i) => (
        <Box key={i}>#{i}</Box>
      ))}
    </View>
  );
}
