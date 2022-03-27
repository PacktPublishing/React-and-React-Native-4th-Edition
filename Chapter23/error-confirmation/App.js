import React, { useState } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import ErrorModal from "./ErrorModal";
import ConfirmationAlert from "./ConfirmationAlert";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  function toggleModal() {
    setModalVisible(!modalVisible);
  }

  function toggleAlert() {
    setAlertVisible(!alertVisible);
  }

  return (
    <View style={styles.container}>
      <ErrorModal
        animationType="fade"
        visible={modalVisible}
        onPressConfirm={toggleModal}
        onPressCancel={toggleModal}
      />
      <ConfirmationAlert
        message="Failed to do the thing..."
        visible={alertVisible}
        buttons={[
          {
            text: "Dismiss",
            onPress: toggleAlert,
          },
        ]}
      />
      <Text style={styles.text} onPress={toggleModal}>
        Show Error Modal
      </Text>
      <Text style={styles.text} onPress={toggleAlert}>
        Show Error Alert
      </Text>
    </View>
  );
}
