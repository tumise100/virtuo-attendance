import { View, StatusBar, ScrollView } from "react-native";
import React, { useRef } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { ModalProp, AttendanceStatusType } from "@/src/shared";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import Modal from "@/src/components/UI/Modal";
import ClassViewFilterContent from "./components/ClassViewFilterContent";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import InputWithFilter from "@/src/components/UI/InputWithFilter";

const ClassViewScreen = () => {
  const classViewFilterModalRef = useRef<ModalProp>(null);

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18
          text="Intro to Computer Sci."
          customClassName="ml-5"
        />
      </View>
      <View className="flex-1">
        <ClassCardOverview showAttendanceStats={false} customclassName="mt-6" />

        <View className="flex-row justify-between items-center mt-2">
          <AttendanceCard
            title="Present"
            subtitle="120 students"
            borderColor="border-success-600"
          />
          <AttendanceCard
            title="Absent"
            subtitle="20 students"
            borderColor="border-danger-500"
          />
        </View>

        <InputWithFilter filterModalRef={classViewFilterModalRef} />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <BodyText text="Students" type={TextFontType.Bold} />
            <BodyText text="140" type={TextFontType.Bold} />
          </View>
          <ScrollView className="flex-1">
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.ABSENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.ABSENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.ABSENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.ABSENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <StudentOverviewCard
              hideStatsShowOnlyAttendanceStat={true}
              attendanceStatusType={AttendanceStatusType.PRESENT}
            />
            <View className="h-20" />
          </ScrollView>
        </View>
      </View>
      <FloatingButton title="Export attendance" />

      <Modal
        ref={classViewFilterModalRef}
        onCancel={() => classViewFilterModalRef.current?.setVisible(false)}
      >
        <ClassViewFilterContent />
      </Modal>
    </View>
  );
};

export default ClassViewScreen;
