import React from "react";
import { StatusBar } from "react-native";
import { NativeBaseProvider, Box, Text, HStack, Center } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Roboto_500Medium,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";
import { theme } from "./theme";
import { FooterButton } from "./FooterButton";

export default function Container({ children, title }) {
  const [selected, setSelected] = React.useState(0);
  const [fontsLoaded] = useFonts({
    Roboto_500Medium,
    Roboto_400Regular,
    ...Ionicons.font,
  });

  if (fontsLoaded) {
    return (
      <NativeBaseProvider theme={theme}>
        <StatusBar bg="#3700B3" barStyle="light-content" />
        <Box safeAreaTop bg="#6200ee" />
        <HStack
          bg="#6200ee"
          px="1"
          py="3"
          justifyContent="center"
          alignItems="center"
          w="100%"
        >
          <Text color="white" fontSize="20" fontWeight="bold">
            {title}
          </Text>
        </HStack>

        <Box flex={1} safeAreaTop width="100%" alignSelf="center">
          <Center flex={1}>
            <Box>{children}</Box>
          </Center>
          <HStack bg="#6200ee" alignItems="center" safeAreaBottom shadow={6}>
            <FooterButton
              title="Home"
              iconName="home"
              selected={selected === 0}
              onPress={() => setSelected(0)}
            />

            <FooterButton
              title="Settings"
              iconName="settings"
              selected={selected === 1}
              onPress={() => setSelected(1)}
            />

            <FooterButton
              title="Help"
              iconName="help"
              selected={selected === 2}
              onPress={() => setSelected(2)}
            />

            <FooterButton
              title="Contact"
              iconName="person"
              selected={selected === 3}
              onPress={() => setSelected(3)}
            />
          </HStack>
        </Box>
      </NativeBaseProvider>
    );
  } else {
    return <AppLoading />;
  }
}
