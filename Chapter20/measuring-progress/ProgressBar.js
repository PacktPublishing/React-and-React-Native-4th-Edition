import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import styles from "./styles";
import { ProgressBarComponent, progressProps } from "./ProgressBarComponent";

function ProgressLabel({ show, progress }) {
  return (
    show && (
      <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
    )
  );
}

export default function ProgressBar({ progress, label }) {
  return (
    <View style={styles.progress}>
      <ProgressLabel show={label} progress={progress} />
      <ProgressBarComponent
        {...progressProps}
        style={styles.progress}
        progress={progress}
      />
    </View>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  label: PropTypes.bool.isRequired,
};

ProgressBar.defaultProps = {
  progress: 0,
  label: true,
};
