import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import styles from "./styles";

const connectedMap = {
  none: "Disconnected",
  unknown: "Disconnected",
  wifi: "Connected",
  cell: "Connected",
  mobile: "Connected",
};

export default function App() {
  const [connected, setConnected] = useState("");

  useEffect(() => {
    function onNetworkChange(connection) {
      setConnected(connectedMap[connection.type]);
    }

    const unsubscribe = NetInfo.addEventListener(onNetworkChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>{connected}</Text>
    </View>
  );
}
