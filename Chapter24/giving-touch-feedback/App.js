import React from "react";
import { View } from "react-native";
import styles from "./styles";
import Button from "./Button";
import PressableButton from "./PressableButton";

export default function App() {
  return (
    <View style={styles.container}>
      <Button onPress={() => {}} label="Opacity" />
      <Button onPress={() => {}} label="Highlight" touchable="highlight" />
      <PressableButton />
    </View>
  );
}
