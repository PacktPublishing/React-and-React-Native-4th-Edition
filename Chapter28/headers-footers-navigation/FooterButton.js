import { Text, Pressable, Center, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons";

export const FooterButton = ({ selected, onPress, title, iconName }) => {
  return (
    <Pressable opacity={selected ? 1 : 0.5} py="3" flex={1} onPress={onPress}>
      <Center>
        <Icon as={Ionicons} mb="1" name={iconName} color="white" size="sm" />
        <Text color="white" fontSize="12">
          {title}
        </Text>
      </Center>
    </Pressable>
  );
};
