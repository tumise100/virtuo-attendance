// ClassViewScreen

import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "../DrawerNavigator";
import ClassViewScreen from "@/src/screens/ClassViewScreen";

const BaseNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ClassViewScreen" component={ClassViewScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
