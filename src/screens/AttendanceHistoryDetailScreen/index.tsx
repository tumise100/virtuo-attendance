import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { AttendanceHistoryButton } from "../AllStudentScreen/components";

const AttendanceHistoryDetailScreen = () => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18
          text="Monday, 16th March, 2024"
          customClassName="ml-5"
        />
      </View>
      <AttendanceHistoryButton
        title="Morning Attendance"
        leftText="90% avg"
        customClassName="mt-5 bg-info-500"
        titleClassName="text-white"
        leftTextClassName="text-white"
      />
      <ScrollView>
        <View className="flex-row justify-between items-center mt-3">
          <AttendanceCard
            title="Presents"
            subtitle={"120 Students"}
            borderColor="border-success-500"
          />
          <AttendanceCard
            title="Absents"
            subtitle={"20 Students"}
            borderColor="border-danger-500"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceHistoryDetailScreen;
