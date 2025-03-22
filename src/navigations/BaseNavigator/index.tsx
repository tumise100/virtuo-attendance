// ClassViewScreen
import FilterStudentsByModal from "@/src/components/CustomModals/FilterStudentsByModal/FilterStudentsBy";
import FilterStudentsByLevelModal from "@/src/components/CustomModals/FilterStudentsByModal/FilterStudentsByLevel";
import FilterStudentsByPercentageModal from "@/src/components/CustomModals/FilterStudentsByModal/FilterStudentsByPercentage";
import { FilterModalContext } from "@/src/contexts/modals.context";
import AboutUsScreen from "@/src/screens/AboutUsScreen";
import AllCourseScreen from "@/src/screens/AllCourseScreen";
import AllStudentScreen from "@/src/screens/AllStudentScreen";
import AttendanceHistoryDetailForInstructorScreen from "@/src/screens/AttendanceHistoryDetailForInstructorScreen";
import AttendanceHistoryDetailScreen from "@/src/screens/AttendanceHistoryDetailScreen";
import AttendanceHistoryHeaderForInstructorScreen from "@/src/screens/AttendanceHistoryHeaderForInstructorScreen";
import AttendanceHistoryScreen from "@/src/screens/AttendanceHistoryScreen";
import AttendanceTakingForInstructorScreen from "@/src/screens/AttendanceTakingForInstructorScreen";
import AttendanceTakingForSecondaryScreen from "@/src/screens/AttendanceTakingForSecondaryScreen";
import AttendanceTakingScreen from "@/src/screens/AttendanceTakingScreen";
import ChangePasswordScreen from "@/src/screens/ChangePasswordScreen";
import ClassViewScreen from "@/src/screens/ClassViewScreen";
import CourseViewScreen from "@/src/screens/CourseViewScreen";
import CreateNewStudentTagScreen from "@/src/screens/CreateNewStudentTagScreen";
import InstructorAttendanceViewScreen from "@/src/screens/InstructorAttendanceViewScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";
import SecondaryAllTeacherScreen from "@/src/screens/SecondaryAllTeacherScreen";
import SecondaryClassDetailScreen from "@/src/screens/SecondaryClassDetailScreen";
import SecondaryStudentAttendanceViewScreen from "@/src/screens/SecondaryStudentAttendanceViewScreen";
import StudentAttendanceScreen from "@/src/screens/StudentAttendanceScreen";
import StudentViewScreen from "@/src/screens/StudentViewScreen";
import SupportScreen from "@/src/screens/SupportScreen";
import WriteStudentInfoTagScreen from "@/src/screens/WriteStudentInfoTagScreen";
import { ModalProp } from "@/src/shared";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useRef } from "react";
import AllClassScreen from "../../screens/AllClassScreen";
import DrawerNavigator from "../DrawerNavigator";

const BaseNavigator = () => {
  const Stack = createStackNavigator();

  const filterStudentsByModalRef = useRef<ModalProp>(null);
  const filterStudentsByPercentageModalRef = useRef<ModalProp>(null);
  const filterStudentsByLevelModalRef = useRef<ModalProp>(null);

  return (
    <FilterModalContext.Provider
      value={{
        filterStudentsByLevelModalRef,
        filterStudentsByModalRef,
        filterStudentsByPercentageModalRef,
      }}
    >
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
        <Stack.Screen
          name="WriteStudentInfoTagScreen"
          component={WriteStudentInfoTagScreen}
        />
        <Stack.Screen
          name="AttendanceHistoryScreen"
          component={AttendanceHistoryScreen}
        />
        <Stack.Screen
          name="AttendanceHistoryDetailScreen"
          component={AttendanceHistoryDetailScreen}
        />
        <Stack.Screen name="AllClassScreen" component={AllClassScreen} />
        <Stack.Screen
          name="SecondaryClassDetailScreen"
          component={SecondaryClassDetailScreen}
        />
        <Stack.Screen
          name="AttendanceTakingForSecondaryScreen"
          component={AttendanceTakingForSecondaryScreen}
        />
        <Stack.Screen
          name="AttendanceTakingForInstructorScreen"
          component={AttendanceTakingForInstructorScreen}
        />
        <Stack.Screen
          name="SecondaryStudentAttendanceViewScreen"
          component={SecondaryStudentAttendanceViewScreen}
        />
        <Stack.Screen
          name="InstructorAttendanceViewScreen"
          component={InstructorAttendanceViewScreen}
        />
        <Stack.Screen
          name="SecondaryAllTeacherScreen"
          component={SecondaryAllTeacherScreen}
        />
        <Stack.Screen
          name="AttendanceHistoryHeaderForInstructorScreen"
          component={AttendanceHistoryHeaderForInstructorScreen}
        />
        <Stack.Screen
          name="AttendanceHistoryDetailForInstructorScreen"
          component={AttendanceHistoryDetailForInstructorScreen}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
      </Stack.Navigator>
      <FilterStudentsByLevelModal />
      <FilterStudentsByModal />
      <FilterStudentsByPercentageModal />
    </FilterModalContext.Provider>
  );
};

export default BaseNavigator;
