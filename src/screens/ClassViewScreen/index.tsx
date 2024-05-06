import { View, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import {
  ModalProp,
  AttendanceStatusType,
  StackNavigationProps,
} from "@/src/shared";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import Modal from "@/src/components/UI/Modal";
import ClassViewFilterContent from "./components/ClassViewFilterContent";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import { ICourse } from "@/src/contracts/course";
import { GetACourse } from "@/src/services/auth";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

const ClassViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const classViewFilterModalRef = useRef<ModalProp>(null);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(false);
  // const { user } = combineStore();

  useEffect(() => {
    console.log(route);
  }, [route]);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    setLoading(true);
    await GetACourse("BIO101")
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "my course");
        if (responseStatus === 200) {
          setCourse(responseData);
        } else {
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <View className="flex-1 px-4 py-7">
        <LoadingComponent />
      </View>
    );
  }

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
