import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { MaterialIcons } from "@expo/vector-icons";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import { StackNavigationProps } from "@/src/shared";

const CourseViewScreen = ({navigation}:StackNavigationProps) => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18
            text="Intro to Computer Sci."
            customClassName="ml-5"
          />
        </View>
        <MaterialIcons name="filter-list" size={24} />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center mt-7">
          <AttendanceCard
            title="Total Students"
            subtitle="120"
            borderColor="border-primary-500"
          />
          <AttendanceCard
            title="Average attendance"
            subtitle="89%"
            borderColor="border-blue-500"
          />
        </View>
        <View className="flex-1">
          <BodyText
            text="Classes"
            type={TextFontType.Bold}
            customClassName="my-4"
          />
          <ScrollView className="flex-1">
            {[1, 2, 3, 4, 5, 5, 6, 7, 3, 2, 2].map((i, _) => (
              <ClassCardOverview key={_} />
            ))}
          </ScrollView>
        </View>
      </View>
      <FloatingButton
        title="New attendance"
        onPress={() => navigation.navigate("AttendanceTakingScreen")}
      />
    </View>
  );
};

export default CourseViewScreen;
