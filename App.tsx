import React from "react";
// import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import AuthNavigator from "./src/navigations/AuthNavigator";
import BaseNavigator from "./src/navigations/BaseNavigator";
import NfcScreen from "./src/screens/NfcScreen";
import { combineStore } from "./src/store";
import { Platform, Text, View } from "react-native";
import "./global.css"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const isIosPlatform = Platform.OS === 'ios';

export default function App() {
  const Stack = createStackNavigator();

  const { token } = combineStore();
  const insets = useSafeAreaInsets();



  // return <Text>Hello</Text>

  return (
    <PaperProvider>
      <NavigationContainer>
        <View style={{
          flex: 1,
          // paddingTop: isIosPlatform ? null : insets.top,
          paddingTop: insets.top,
          paddingBottom: isIosPlatform ? insets.bottom / 2 : insets.bottom,
          // paddingBottom: insets.bottom,
          paddingLeft: isIosPlatform ? null : insets.left,
          paddingRight: isIosPlatform ? null : insets.right,
        }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {token ? (
              <Stack.Screen name="BaseNavigator" component={BaseNavigator} />
            ) : (
              <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
            )}
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider >
  );
}
