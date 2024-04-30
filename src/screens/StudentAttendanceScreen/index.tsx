import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useRef } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import { AttendanceStatusType, ModalProp } from "@/src/shared";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import Modal from "@/src/components/UI/Modal";
import FilterStudentsBy from "./components/FilterStudentsBy";
import FilterStudentsByPercentage from "./components/FilterStudentsByPercentage";
import FilterStudentsByLevel from "./components/FilterStudentsByLevel";

const StudentAttendanceScreen = () => {
  const filterStudentsByModalRef = useRef<ModalProp>(null);
  const filterStudentsByPercentageModalRef = useRef<ModalProp>(null);
  const filterStudentsByLevelModalRef = useRef<ModalProp>(null);

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Students" customClassName="ml-5" />
      </View>
      <InputWithFilter filterModalRef={filterStudentsByModalRef} />
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <BodyText text="Students" type={TextFontType.Bold} />
          <BodyText text="140" type={TextFontType.Bold} />
        </View>
        <ScrollView className="flex-1 mt-2">
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.ABSENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.ABSENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.ABSENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.PRESENT}
          />
          <StudentOverviewCard
            hideStatsShowOnlyAttendanceAverage={true}
            attendanceStatusType={AttendanceStatusType.ABSENT}
          />

          <View className="h-20" />
        </ScrollView>
      </View>
      <FloatingButton title="Export Student" />

      <Modal
        ref={filterStudentsByModalRef}
        onCancel={() => filterStudentsByModalRef.current?.setVisible(false)}
      >
        <FilterStudentsBy
          onPercentagePress={() => {
            filterStudentsByPercentageModalRef.current?.setVisible(true);
            filterStudentsByModalRef.current?.setVisible(false);
          }}
          onLevelPress={() => {
            filterStudentsByLevelModalRef.current?.setVisible(true);
            filterStudentsByModalRef.current?.setVisible(false);
          }}
        />
      </Modal>

      <Modal
        ref={filterStudentsByPercentageModalRef}
        onCancel={() => {
          filterStudentsByPercentageModalRef.current?.setVisible(false);
          //   filterStudentsByModalRef.current?.setVisible(true);
        }}
      >
        <FilterStudentsByPercentage />
      </Modal>

      <Modal
        ref={filterStudentsByLevelModalRef}
        onCancel={() => {
          filterStudentsByLevelModalRef.current?.setVisible(false);
          //   filterStudentsByModalRef.current?.setVisible(true);
        }}
      >
        <FilterStudentsByLevel />
      </Modal>
    </View>
  );
};

export default StudentAttendanceScreen;
