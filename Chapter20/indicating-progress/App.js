import React from "react";
import { View, ActivityIndicator } from "react-native";
import styles from "./styles";

export default function App() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}
