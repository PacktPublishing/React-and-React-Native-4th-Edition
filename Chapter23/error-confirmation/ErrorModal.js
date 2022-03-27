import React from "react";
import { View, Text, Modal } from "react-native";
import styles from "./styles";

const innerViewStyle = [styles.modalInner, styles.modalInnerError];
const textStyle = [styles.modalText, styles.modalTextError];
const buttonStyle = [styles.modalButton, styles.modalButtonError];

export default function ErrorModal(props) {
  return (
    <Modal {...props}>
      <View style={styles.modalContainer}>
        <View style={innerViewStyle}>
          <Text style={textStyle}>Epic fail!</Text>
          <Text style={buttonStyle} onPress={props.onPressConfirm}>
            Fix it
          </Text>
          <Text style={buttonStyle} onPress={props.onPressCancel}>
            Ignore it
          </Text>
        </View>
      </View>
    </Modal>
  );
}

ErrorModal.defaultProps = {
  transparent: true,
  onRequestClose: () => {},
};
