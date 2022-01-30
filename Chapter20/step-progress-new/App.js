import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import First from "./First";
import Second from "./Second";
import Third from "./Third";
import Fourth from "./Fourth";
import ProgressBar from "./ProgressBar";
import styles from "./styles";

const Stack = createNativeStackNavigator();

const routes = [
  { name: "First", component: First },
  { name: "Second", component: Second },
  { name: "Third", component: Third },
  { name: "Fourth", component: Fourth },
];

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ route, navigation }) => {
          const currentRouteIndex = routes
            .map((r) => r.name)
            .indexOf(route.name);
          const prevRouteName = routes[currentRouteIndex - 1]?.name;
          const nextRouteName = routes[currentRouteIndex + 1]?.name;

          return {
            headerTitle: () => (
              <View style={styles.progress}>
                <Text style={styles.title}>{route.name}</Text>
                <ProgressBar label={false} progress={route.params.progress} />
              </View>
            ),
            headerLeft: () => (
              <Button
                title="Previous"
                disabled={currentRouteIndex === 0}
                onPress={() => navigation.navigate(prevRouteName)}
              />
            ),
            headerRight: () => (
              <Button
                title="Next"
                disabled={currentRouteIndex === 3}
                onPress={() => navigation.navigate(nextRouteName)}
              />
            ),
          };
        }}
      >
        {routes.map((routeProps, index) => (
          <Stack.Screen
            key={routeProps.name}
            {...routeProps}
            initialParams={{ progress: (index + 1) / routes.length }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
