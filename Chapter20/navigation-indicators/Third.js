import React from "react";
import { View, Button } from "react-native";
import styles from "./styles";
import loading from "./loading";

const Third = loading(({ navigation }) => (
  <View style={styles.container}>
    <Button title="First" onPress={() => navigation.navigate("First")} />
    <Button title="Second" onPress={() => navigation.navigate("Second")} />
  </View>
));

export default Third;
