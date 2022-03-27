import { useEffect } from "react";
import { Alert } from "react-native";

export default function ConfirmationAlert(props) {
  useEffect(() => {
    if (props.visible) {
      Alert.alert(props.title, props.message, props.buttons);
    }
  }, [props.visible]);

  return null;
}
