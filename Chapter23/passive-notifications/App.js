import React, { useState } from "react";
import { Text, View } from "react-native";
import Notification from "./Notification";
import styles from "./styles";

export default function PassiveNotifications() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState(null);

  return (
    <View style={styles.container}>
      <Notification message={message} />
      <Text
        onPress={() => {
          setCount(count + 1);
          setMessage(null);
        }}
      >
        Pressed {count}
      </Text>
      <Text
        onPress={() => {
          setMessage("Something happened!");
        }}
      >
        Show Notification
      </Text>
    </View>
  );
}
