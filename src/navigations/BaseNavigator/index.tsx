// ClassViewScreen
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "../DrawerNavigator";
import ClassViewScreen from "@/src/screens/ClassViewScreen";
import AllCourseScreen from "@/src/screens/AllCourseScreen";
import CourseViewScreen from "@/src/screens/CourseViewScreen";
import AttendanceTakingScreen from "@/src/screens/AttendanceTakingScreen";
import AllStudentScreen from "@/src/screens/AllStudentScreen";

const BaseNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ClassViewScreen" component={ClassViewScreen} />
      <Stack.Screen name="AllCourseScreen" component={AllCourseScreen} />
      <Stack.Screen name="CourseViewScreen" component={CourseViewScreen} />
      <Stack.Screen
        name="AttendanceTakingScreen"
        component={AttendanceTakingScreen}
      />
      <Stack.Screen name="AllStudentScreen" component={AllStudentScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
