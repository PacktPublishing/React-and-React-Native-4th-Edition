import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import ProgressBar from "./ProgressBar";

export default function First() {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>First Content</Text>
    </View>
  );
}
