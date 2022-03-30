import React, { useState } from "react";
import { View } from "react-native";
import styles from "./styles";
import LazyImage from "./LazyImage";
import Button from "./Button";

const remote = "https://reactnative.dev/docs/assets/favicon.png";

export default function LazyLoading() {
  const [source, setSource] = useState(null);

  return (
    <View style={styles.container}>
      <LazyImage
        style={{ width: 200, height: 150 }}
        resizeMode="contain"
        source={source}
      />
      <Button
        label="Load Remote"
        onPress={() => {
          setSource({ uri: remote });
        }}
      />
    </View>
  );
}
