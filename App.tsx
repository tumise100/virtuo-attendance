import React from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import AuthNavigator from "./src/navigations/AuthNavigator";
import BaseNavigator from "./src/navigations/BaseNavigator";
import NfcScreen from "./src/screens/NfcScreen";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          {/* <Stack.Screen name="BaseNavigator" component={BaseNavigator} /> */}
          {/* <Stack.Screen name="NfcScreen" component={NfcScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
