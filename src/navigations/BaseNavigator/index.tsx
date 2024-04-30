// ClassViewScreen
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "../DrawerNavigator";
import ClassViewScreen from "@/src/screens/ClassViewScreen";
import AllCourseScreen from "@/src/screens/AllCourseScreen";
import CourseViewScreen from "@/src/screens/CourseViewScreen";
import AttendanceTakingScreen from "@/src/screens/AttendanceTakingScreen";
import StudentAttendanceScreen from "@/src/screens/StudentAttendanceScreen";
import StudentViewScreen from "@/src/screens/StudentViewScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";

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
      <Stack.Screen
        name="StudentAttendanceScreen"
        component={StudentAttendanceScreen}
      />
      <Stack.Screen name="StudentViewScreen" component={StudentViewScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
