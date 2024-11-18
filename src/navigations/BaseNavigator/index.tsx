// ClassViewScreen
import { showToast } from "@/src/components/UI/showToast";
import AllCourseScreen from "@/src/screens/AllCourseScreen";
import AttendanceTakingScreen from "@/src/screens/AttendanceTakingScreen";
import ClassViewScreen from "@/src/screens/ClassViewScreen";
import CourseViewScreen from "@/src/screens/CourseViewScreen";
import CreateNewStudentTagScreen from "@/src/screens/CreateNewStudentTagScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";
import StudentAttendanceScreen from "@/src/screens/StudentAttendanceScreen";
import StudentViewScreen from "@/src/screens/StudentViewScreen";
import { GetMe } from "@/src/services/auth";
import { GetLecturerClasses } from "@/src/services/courses";
import { combineStore } from "@/src/store";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import DrawerNavigator from "../DrawerNavigator";
import AllStudentScreen from "@/src/screens/AllStudentScreen";

const BaseNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="ClassViewScreen" component={ClassViewScreen} />
      <Stack.Screen name="AllCourseScreen" component={AllCourseScreen} />
      <Stack.Screen name="AllStudentScreen" component={AllStudentScreen} />
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
      <Stack.Screen
        name="CreateNewStudentTagScreen"
        component={CreateNewStudentTagScreen}
      />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
