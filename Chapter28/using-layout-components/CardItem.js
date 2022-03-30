import { Center } from "native-base";

export const CardItem = ({ children }) => {
  return (
    <Center
      flex={1}
      border="1"
      borderRadius="md"
      bg="gray.200"
      h={50}
      m={1}
      rounded="md"
      shadow={4}
    >
      {children}
    </Center>
  );
};
