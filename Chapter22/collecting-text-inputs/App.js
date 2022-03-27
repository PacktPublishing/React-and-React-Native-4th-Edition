import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, TextInput, View } from "react-native";
import styles from "./styles";

function Input(props) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.textInputLabel}>{props.label}</Text>
      <TextInput style={styles.textInput} {...props} />
    </View>
  );
}

Input.propTypes = {
  label: PropTypes.string,
};

export default function CollectingTextInput() {
  const [changedText, setChangedText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  return (
    <View style={styles.container}>
      <Input label="Basic Text Input:" />
      <Input label="Password Input:" secureTextEntry />
      <Input label="Return Key:" returnKeyType="search" />
      <Input label="Placeholder Text:" placeholder="Search" />
      <Input
        label="Input Events:"
        onChangeText={(e) => {
          setChangedText(e);
        }}
        onSubmitEditing={(e) => {
          setSubmittedText(e.nativeEvent.text);
        }}
        onFocus={() => {
          setChangedText("");
          setSubmittedText("");
        }}
      />
      <Text>Changed: {changedText}</Text>
      <Text>Submitted: {submittedText}</Text>
    </View>
  );
}
