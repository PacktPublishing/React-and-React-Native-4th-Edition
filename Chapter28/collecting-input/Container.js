import React from "react";
import { StatusBar } from "react-native";
import { NativeBaseProvider, Box, Text, HStack } from "native-base";
import AppLoading from "expo-app-loading";
import {
  useFonts,
  Roboto_500Medium,
  Roboto_400Regular,
} from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Container({ title, children }) {
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
        <Box flex={1} w="100%">
          {children}
        </Box>
      </NativeBaseProvider>
    );
  } else {
    return <AppLoading />;
  }
}
