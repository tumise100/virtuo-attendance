import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";

const SecondaryClassDetailScreen = () => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="SSS 1" customClassName="ml-5" />
      </View>
      <View className="flex-row justify-between items-center mt-7">
        <AttendanceCard
          title="Class teacher"
          subtitle={"Mrs Oginni"}
          borderColor="border-primary-500"
        />
        <AttendanceCard
          title="Average Attendance"
          subtitle={"89%"}
          borderColor="border-info-500"
        />
      </View>

      <Text className="my-4">Attendance</Text>
      <ScrollView>
        <View>{/* <AttendanceHistoryCard /> */}</View>
      </ScrollView>
    </View>
  );
};

export default SecondaryClassDetailScreen;
