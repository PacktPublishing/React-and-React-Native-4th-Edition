import React, { useState } from "react";
import { View, Text } from "react-native";
import ConfirmationModal from "./ConfirmationModal";
import ConfirmationAlert from "./ConfirmationAlert";
import styles from "./styles";

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
      <ConfirmationModal
        animationType="fade"
        visible={modalVisible}
        onPressConfirm={toggleModal}
        onPressCancel={toggleModal}
      />
      <ConfirmationAlert
        title="Are you sure?"
        message="For realz?"
        visible={alertVisible}
        buttons={[
          { text: "Nope", onPress: toggleAlert },
          { text: "Yep", onPress: toggleAlert },
        ]}
      />
      <Text style={styles.text} onPress={toggleModal}>
        Show Confirmation Modal
      </Text>
      <Text style={styles.text} onPress={toggleAlert}>
        Show Confimation Alert
      </Text>
    </View>
  );
}
