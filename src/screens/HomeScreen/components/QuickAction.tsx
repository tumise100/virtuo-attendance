import { View, Text } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import QuickActionCard from "@/src/components/UI/QuickActionCard";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigatorProp } from "@/src/shared";
import { combineStore } from "@/src/store";
import { NoUserDataComponent } from "@/src/components/UI/NoData";

type TUserType = "SECONDARY" | "ADMIN" | "TERTIARY" | "SCHOOL";

const QuickAction = () => {
  const navigation = useNavigation<DrawerNavigatorProp>();

  const { user } = combineStore();

  if (!user) return <NoUserDataComponent />;


  return (
    <View className="mt-3">
      <Sub2Text
        type={TextFontType.Bold}
        text="Quick Action"
        customClassName="mb-2"
      />
      <>
        {/* {handleUserType("SECONDARY", navigation).map((outerArr, _outer) => ( */}
        {handleUserType(
          (user.accounts[0].lecturer?.lecturerType as TUserType) ||
            (user.accounts[0].type as TUserType),
          // user.accounts[0].lecturer
          //   ? (user.accounts[0].lecturer.lecturerType as TUserType)
          //   : "ADMIN",
          navigation
        ).map((outerArr, _outer) => (
          <View
            className="flex-row justify-between items-center mb-3"
            key={_outer}
          >
            {outerArr.map((item, _) => (
              <QuickActionCard
                onPress={item.onPress}
                title={item.title}
                subtitle={item.subtitle}
                colorType={item.colorType}
                key={item.title}
              />
            ))}
          </View>
        ))}
      </>
    </View>
  );
};

export default QuickAction;

const handleUserType = (type: TUserType, navigation: DrawerNavigatorProp) => {
  switch (type) {
    case "SECONDARY":
      const secondaryInstructorsActions = [
        [
          {
            title: "Students",
            subtitle: "Manage and mark student attendance",
            onPress: () => navigation.navigate("AllStudentScreen"),
            colorType: "warning",
          },
          {
            title: "Profile",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate("ProfileScreen"),
            colorType: "danger",
          },
        ],
        [
          {
            title: "Classes",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate("AllClassScreen"),
            colorType: "info",
          },
          // {
          //   title: "Mark Sheet",
          //   subtitle: "Export mark sheets of students",
          //   onPress: () => navigation.navigate(""),
          //   colorType: "success",
          // },
        ],
      ];
      return secondaryInstructorsActions;

    case "SCHOOL":
      const adminInstructorActions = [
        [
          {
            title: "Students",
            subtitle: "Manage and mark student attendance",
            onPress: () => navigation.navigate("AllStudentScreen"),
            colorType: "warning",
          },
          {
            title: "Teachers",
            subtitle: "Manage and mark teachers attendance",
            onPress: () => navigation.navigate("SecondaryAllTeacherScreen"),
            colorType: "danger",
          },
        ],
        [
          {
            title: "Classes",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate("AllClassScreen"),
            colorType: "info",
          },
          {
            title: "Mark Sheet",
            subtitle: "Export mark sheets of students",
            onPress: () => navigation.navigate(""),
            colorType: "success",
          },
        ],
      ];
      return adminInstructorActions;

    case "TERTIARY":
      const institutionInstructorsActions = [
        [
          {
            title: "Courses",
            subtitle: "List of courses you take and attendance list",
            onPress: () => navigation.navigate("AllCourseScreen"),
            colorType: "danger",
          },
          {
            title: "Students",
            subtitle: "List of student taking your course",
            onPress: () => navigation.navigate("AllStudentScreen"),
            colorType: "warning",
          },
        ],
        [
          {
            title: "Profile",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate("ProfileScreen"),
            colorType: "info",
          },
          {
            title: "Mark Sheet",
            subtitle: "Export mark sheets of students",
            onPress: () => navigation.navigate(""),
            colorType: "success",
          },
        ],
      ];
      return institutionInstructorsActions;

    default:
      const defaultInstitutionInstructorsActions = [
        [
          {
            title: "Courses",
            subtitle: "List of courses you take and attendance list",
            onPress: () => navigation.navigate("AllCourseScreen"),
            colorType: "danger",
          },
          {
            title: "Students",
            subtitle: "List of student taking your course",
            onPress: () => navigation.navigate("AllStudentScreen"),
            colorType: "warning",
          },
        ],
        [
          {
            title: "Profile",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate("ProfileScreen"),
            colorType: "info",
          },
          {
            title: "Mark Sheet",
            subtitle: "Export mark sheets of students",
            onPress: () => navigation.navigate(""),
            colorType: "success",
          },
        ],
      ];
      return defaultInstitutionInstructorsActions;
  }
};
