import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "@/src/screens/OnboardingScreen";
import SignUpScreen from "@/src/screens/SignUpScreen";
import ConfirmEmailScreen from "@/src/screens/ConfirmEmailScreen";
import RegisterCourseToTakeScreen from "@/src/screens/RegisterCourseToTakeScreen";
import RegistrationCompleteScreen from "@/src/screens/RegistrationCompleteScreen";
import SignInScreen from "@/src/screens/SignInScreen";

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ConfirmEmailScreen" component={ConfirmEmailScreen} />
      <Stack.Screen
        name="RegisterCourseToTakeScreen"
        component={RegisterCourseToTakeScreen}
      />
      <Stack.Screen
        name="RegistrationCompleteScreen"
        component={RegistrationCompleteScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
