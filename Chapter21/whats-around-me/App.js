import React from "react";
import { View, StatusBar } from "react-native";
import MapView from "react-native-maps";
import styles from "./styles";

StatusBar.setBarStyle("dark-content");

export default () => (
  <View style={styles.container}>
    <MapView style={styles.mapView} showsUserLocation followUserLocation />
  </View>
);
