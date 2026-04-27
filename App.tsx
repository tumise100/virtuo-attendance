import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import AuthNavigator from "./src/navigations/AuthNavigator";
import BaseNavigator from "./src/navigations/BaseNavigator";
import { combineStore } from "./src/store";
import { Platform, View } from "react-native";
import "./global.css"
import { useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context";

export const isIosPlatform = Platform.OS === 'ios';

function AppContent() {
  const Stack = createStackNavigator();
  const { token } = combineStore();
  // const token = "MOCK_TOKEN"; // Forced for UI navigation
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: isIosPlatform ? insets.bottom / 2 : insets.bottom,
      paddingLeft: isIosPlatform ? 0 : insets.left,
      paddingRight: isIosPlatform ? 0 : insets.right,
    }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="BaseNavigator" component={BaseNavigator} />
        ) : (
          <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
