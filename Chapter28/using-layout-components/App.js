import React from "react";
import { HStack } from "native-base";
import Container from "./Container";
import { CardItem } from "./CardItem";

export default function App() {
  return (
    <Container title="Using Layout Components">
      <HStack space={3} justifyContent="center" alignItems="center" mt={2}>
        <CardItem>Card 1</CardItem>
        <CardItem>Card 2</CardItem>
      </HStack>

      <HStack space={3} justifyContent="center" alignItems="center" mt={2}>
        <CardItem>Card 3</CardItem>
        <CardItem>Card 4</CardItem>
      </HStack>
    </Container>
  );
}
