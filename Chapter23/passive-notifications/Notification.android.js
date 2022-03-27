import React from "react";
import { ToastAndroid } from "react-native";

export default function Notification({ message, duration }) {
  React.useEffect(() => {
    if (message) {
      ToastAndroid.show(message, duration);
    }
  }, [message]);

  return null;
}

Notification.defaultProps = {
  duration: ToastAndroid.LONG,
};
