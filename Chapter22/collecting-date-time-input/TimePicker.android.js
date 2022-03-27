import React from "react";
import { Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles";

function pickDate(options, onTimeChange) {
  DateTimePicker.open(options).then((time) =>
    onTimeChange(new Date(0, 0, 1, time.hour, time.minute))
  );
}

export default function TimePicker({ label, value, onChange }) {
  return (
    <View style={styles.datePickerContainer}>
      <Text style={styles.datePickerLabel}>{label}</Text>
      <Text onPress={() => pickDate({ date: value }, onChange)}>
        {value.toLocaleTimeString()}
      </Text>
    </View>
  );
}
