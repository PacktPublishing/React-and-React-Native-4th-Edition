import React from "react";
import { View, Button } from "react-native";
import styles from "./styles";
import loading from "./loading";

const Second = loading(({ navigation }) => (
  <View style={styles.container}>
    <Button title="First" onPress={() => navigation.navigate("First")} />
    <Button title="Third" onPress={() => navigation.navigate("Third")} />
  </View>
));

export default Second;
