import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useContext } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import { FilterModalContext } from "@/src/contexts/modals.context";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { AttendanceStatusType } from "@/src/shared";

const AttendanceHistoryDetailScreen = () => {
  const { filterStudentsByModalRef } = useContext(FilterModalContext);

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
      <View>
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

        <InputWithFilter filterModalRef={filterStudentsByModalRef} />

        <View className="flex-row justify-between items-center">
          <BodyText text="Students" type={TextFontType.Bold} />
          <BodyText text={`3`} type={TextFontType.Bold} />
        </View>
        <ScrollView className="mt-2">
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceStat={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
            fullName={`Yemi Ogunmoye`}
            studentId={1}
            subtitle={"Computer Sci. 100Level"}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceStat={true}
            attendanceStatusType={AttendanceStatusType.ABSENT}
            fullName={`Yemi Ogunmoye`}
            studentId={1}
            subtitle={"Computer Sci. 100Level"}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceStat={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
            fullName={`Yemi Ogunmoye`}
            studentId={1}
            subtitle={"Computer Sci. 100Level"}
          />

          <View className="h-20" />
        </ScrollView>
      </View>
    </View>
  );
};

export default AttendanceHistoryDetailScreen;
