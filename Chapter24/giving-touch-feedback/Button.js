import React from "react";
import { Text, TouchableOpacity, TouchableHighlight } from "react-native";
import styles from "./styles";

const touchables = new Map([
  ["opacity", TouchableOpacity],
  ["highlight", TouchableHighlight],
  [undefined, TouchableOpacity],
]);

export default function Button({ label, onPress, touchable }) {
  const Touchable = touchables.get(touchable);
  const touchableProps = {
    style: styles.button,
    underlayColor: "rgba(112,128,144,0.3)",
    onPress,
  };

  return (
    <Touchable {...touchableProps}>
      <Text style={styles.buttonText}> {label} </Text>
    </Touchable>
  );
}
