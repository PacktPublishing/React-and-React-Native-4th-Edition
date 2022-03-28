import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import styles from "./styles";

export default PressableButton = () => {
  const [text, setText] = useState(0);

  return (
    <Pressable
      onPressIn={() => setText("Pressed")}
      onPressOut={() => setText("Press")}
      onLongPress={() => {
        setText("Long Pressed");
      }}
      delayLongPress={500}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        styles.button,
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};
