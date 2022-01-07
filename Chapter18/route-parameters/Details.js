import React from "react";
import { View, Text, StatusBar } from "react-native";
import styles from "./styles";

export default function ({ route }) {
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text>{title}</Text>
    </View>
  );
}
