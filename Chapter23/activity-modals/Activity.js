import React from "react";
import { View, Modal, ActivityIndicator } from "react-native";
import styles from "./styles";

export default function Activity(props) {
  return (
    <Modal visible={props.visible} transparent>
      <View style={styles.modalContainer}>
        <ActivityIndicator size={props.size} />
      </View>
    </Modal>
  );
}

Activity.defaultProps = {
  visible: false,
  size: "large",
};
