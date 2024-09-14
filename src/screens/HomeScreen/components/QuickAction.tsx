import { View, Text } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import QuickActionCard from "@/src/components/UI/QuickActionCard";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigatorProp } from "@/src/shared";

const QuickAction = () => {
  const navigation = useNavigation<DrawerNavigatorProp>();
  return (
    <View className="mt-3">
      <Sub2Text
        type={TextFontType.Bold}
        text="Quick Action"
        customClassName="mb-2"
      />
      <>
        <View className="flex-row justify-between items-center">
          <QuickActionCard
            onPress={() => navigation.navigate("AllCourseScreen")}
            title="Courses"
            subtitle="List of courses you take and attendance list"
            colorType="danger"
          />
          <QuickActionCard
            title="Students"
            subtitle="List of student taking your course"
            colorType="warning"
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
        </View>
      </>
    </View>
  );
};

export default QuickAction;
