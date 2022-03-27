import React from "react";
import { Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";

export default function DatePicker(props) {
  return (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{props.label}</Text>
      <DateTimePicker mode="date" display="spinner" {...props} />
    </View>
  );
}
