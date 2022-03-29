import { Text, TouchableOpacity } from "react-native";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";
import { styles } from "./styles";

export const TodoItem = ({ id, title, onPress }) => {
  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
      <TouchableOpacity onPress={() => onPress(id)} style={styles.todoItem}>
        <Text>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
