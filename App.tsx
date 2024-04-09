import React from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./src/navigations/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import { PaperProvider } from "react-native-paper";
import ConfirmEmailScreen from "./src/screens/ConfirmEmailScreen";
import RegisterCourseToTakeScreen from "./src/screens/RegisterCourseToTakeScreen";
import RegistrationCompleteScreen from "./src/screens/RegistrationCompleteScreen";
import SignInScreen from "./src/screens/SignInScreen";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen
            name="ConfirmEmailScreen"
            component={ConfirmEmailScreen}
          />
          <Stack.Screen
            name="RegisterCourseToTakeScreen"
            component={RegisterCourseToTakeScreen}
          />
          <Stack.Screen
            name="RegistrationCompleteScreen"
            component={RegistrationCompleteScreen}
          />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
