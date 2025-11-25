import React from "react";
// import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import AuthNavigator from "./src/navigations/AuthNavigator";
import BaseNavigator from "./src/navigations/BaseNavigator";
import NfcScreen from "./src/screens/NfcScreen";
import { combineStore } from "./src/store";
import { Text } from "react-native";
import "./global.css"

export default function App() {
  const Stack = createStackNavigator();

  const { token } = combineStore();


  // return <Text>Hello</Text>

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {token ? (
            <Stack.Screen name="BaseNavigator" component={BaseNavigator} />
          ) : (
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
