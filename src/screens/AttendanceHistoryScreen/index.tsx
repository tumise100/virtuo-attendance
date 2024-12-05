import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { AttendanceHistoryCard } from "./components";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";

const AttendanceHistoryScreen = () => {
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
          text="Attendance history"
          customClassName="ml-5"
        />
      </View>
      <ScrollView>
        <View className="flex-row justify-between items-center mt-7">
          <AttendanceCard
            title="Total Students"
            subtitle={"740"}
            borderColor="border-primary-500"
          />
          <AttendanceCard
            title="Average Attendance"
            subtitle={"89%"}
            borderColor="border-info-500"
          />
        </View>

        <Text className="my-4">Attendance</Text>
        <View>
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
          <AttendanceHistoryCard />
        </View>
      </ScrollView>
      <FloatingButton title={"Mark Attendance"} />
    </View>
  );
};

export default AttendanceHistoryScreen;
