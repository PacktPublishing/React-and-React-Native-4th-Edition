import React from "react";
import { Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";

function pickDate(options, onDateChange) {
  DateTimePicker.open(options).then((date) =>
    onDateChange(new Date(date.year, date.month, date.day))
  );
}

export default function DatePicker({ label, value, onChange }) {
  return (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <Text onPress={() => pickDate({ date: value }, onChange)}>
        {value.toLocaleDateString()}
      </Text>
    </View>
  );
}
