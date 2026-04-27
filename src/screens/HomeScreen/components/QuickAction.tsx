import { View } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import QuickActionCard from "@/src/components/UI/QuickActionCard";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigatorProp } from "@/src/shared";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons"; // Ensure imports

const QuickAction = () => {
  const navigation = useNavigation<DrawerNavigatorProp>();

  // Hardcoded actions to match the design request
  // Row 1: Students (Yellow), Teachers (Red)
  // Row 2: Classes (Blue), Results (Green)
  const quickActions = [
    [
      {
        title: "Students",
        subtitle: "Manage and mark student attendance",
        onPress: () => navigation.navigate("AllStudentScreen"),
        colorType: "warning", // Yellow
        iconName: "people-outline",
        Icon: Ionicons,
      },
      {
        title: "Teachers",
        subtitle: "Manage and mark teachers attendance",
        onPress: () => navigation.navigate("SecondaryAllTeacherScreen"), // Or relevant screen
        colorType: "danger", // Red
        iconName: "person-outline", // Or maybe 'easel-outline' if teaching? Image looks like a person.
        Icon: Ionicons,
      },
    ],
    [
      {
        title: "Classes",
        subtitle: "Manage classes and students",
        onPress: () => navigation.navigate("AllClassScreen"),
        colorType: "info", // Blue
        iconName: "paper-plane-outline", // Image has a send/arrow icon
        Icon: Ionicons,
      },
      {
        title: "Results",
        subtitle: "Manage and export mark sheets of students",
        onPress: () => navigation.navigate("ManageResultScreen"), // Connected to ManageResultScreen
        colorType: "success", // Green
        iconName: "file-text", // Document icon
        Icon: Feather,
      },
    ],
  ];

  return (
    <View className="mt-3">
      <Sub2Text
        type={TextFontType.Bold}
        text="Quick Action"
        customClassName="mb-2"
      />
      <>
        {quickActions.map((row, rowIndex) => (
          <View
            className="flex-row justify-between items-center mb-2"
            key={rowIndex}
          >
            {row.map((item, index) => (
              <QuickActionCard
                onPress={item.onPress}
                title={item.title}
                subtitle={item.subtitle}
                colorType={item.colorType}
                key={item.title}
                iconName={item.iconName}
                Icon={item.Icon}
              />
            ))}
          </View>
        ))}
      </>
    </View>
  );
};

export default QuickAction;
