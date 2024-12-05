import { View, Text } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import QuickActionCard from "@/src/components/UI/QuickActionCard";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigatorProp } from "@/src/shared";
import { combineStore } from "@/src/store";
import { NoUserDataComponent } from "@/src/components/UI/NoData";

const QuickAction = () => {
  const navigation = useNavigation<DrawerNavigatorProp>();

  const { user } = combineStore();

  if (!user) return <NoUserDataComponent />;

  const isSecondaryInstructor =
    user.accounts[0].lecturer.lecturerType === "SECONDARY";

  // console.log(user.accounts[0].lecturer.lecturerType, "user");

  return (
    <View className="mt-3">
      <Sub2Text
        type={TextFontType.Bold}
        text="Quick Action"
        customClassName="mb-2"
      />
      <>
        {handleUserType("SECONDARY", navigation).map((outerArr) => (
          <View className="flex-row justify-between items-center mb-3">
            {outerArr.map((item, _) => (
              <QuickActionCard
                onPress={item.onPress}
                title={item.title}
                subtitle={item.subtitle}
                colorType={item.colorType}
                key={_}
              />
            ))}
          </View>
        ))}

        {/* <View className="flex-row justify-between items-center">
          <QuickActionCard
            onPress={() => navigation.navigate("AllCourseScreen")}
            title={isSecondaryInstructor ? "Classes" : "Courses"}
            subtitle="List of courses you take and attendance list"
            colorType="danger"
          />
          <QuickActionCard
            title="Students"
            subtitle="List of student taking your course"
            colorType="warning"
            onPress={() => navigation.navigate("AllStudentScreen")}
          />
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <QuickActionCard
            title="Profile"
            onPress={() => navigation.navigate("ProfileScreen")}
            subtitle="Update your profile and sessions"
            colorType="info"
          />
          <QuickActionCard
            title="Mark Sheet"
            subtitle="Export mark sheets of students"
            colorType="success"
          />
        </View> */}
      </>
    </View>
  );
};

export default QuickAction;

const handleUserType = (type: string, navigation: DrawerNavigatorProp) => {
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
            onPress: () => navigation.navigate(""),
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

    case "Admin":
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
            onPress: () => navigation.navigate(""),
            colorType: "danger",
          },
        ],
        [
          {
            title: "Classes",
            subtitle: "Manage classes and students",
            onPress: () => navigation.navigate(""),
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

    default:
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
  }
};
