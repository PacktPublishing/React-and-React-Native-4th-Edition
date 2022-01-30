import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import styles from "./styles";

export default function loading(Wrapped) {
  return function LoadingWrapper(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, []);

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return <Wrapped {...props} />;
    }
  };
}
