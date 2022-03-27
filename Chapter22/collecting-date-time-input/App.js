import React, { useState } from "react";
import { View } from "react-native";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import styles from "./styles";

export default function CollectingDateTimeInput() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  return (
    <View style={styles.container}>
      <DatePicker
        label="Pick a date, any date:"
        value={date}
        onChange={setDate}
      />
      <TimePicker
        label="Pick a time, any time:"
        value={time}
        onChange={setTime}
      />
    </View>
  );
}
