import { View, Text, ScrollView, StatusBar } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";
import { GetASingleStudentAttendance } from "@/src/services/attendance";
import { StackNavigationProps } from "@/src/shared";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { ISecondaryStudentAttendanceDetail } from "@/src/contracts/attendance";
import NoDataComponent from "@/src/components/UI/NoData";

const SecondaryStudentAttendanceViewScreen = ({
  route,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);
  const [studentAttendance, setStudentAttendance] =
    useState<ISecondaryStudentAttendanceDetail | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.studentId) {
      handleFetchStudentAttendance(route.params.studentId);
    }
  }, [route]);

  const handleFetchStudentAttendance = (studentId: string) => {
    setLoading(true);
    GetASingleStudentAttendance(studentId)
      .then(({ responseData, responseStatus }) => {
        if (responseData.studentData) {
          setStudentAttendance(responseData);
        }
        console.log(responseData, "studnet responseData");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View className="flex-1 px-4 py-7 bg-white">
        <LoadingComponent />
        <LoadingComponent />
      </View>
    );
  }

  return studentAttendance ? (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text={`JSS9`} customClassName="ml-5" />
      </View>
      <View className="flex-row justify-between items-center mt-7">
        <AttendanceCard
          title="Presents"
          subtitle={`${studentAttendance.totalPresent}`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${studentAttendance.totalAbsent}`}
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {studentAttendance.attendancedata.map((item) => {
          return (
            <>
              <AttendanceHistoryCard
                item={{ date: item.date }}
                isMorningType={true}
                attended={item.morningAttendance}
                key={item.id + "1"}
                showAttendanceStatus
                alt
                />
              <AttendanceHistoryCard
                item={{ date: item.date }}
                isAfternoonType={true}
                attended={item.afternoonAttendance}
                key={item.id + "2"}
                showAttendanceStatus
                alt
              />
            </>
          );
        })}
      </View>
      <View className="h-20" />
    </ScrollView>
  ) : (
    <NoDataComponent />
  );
};

export default SecondaryStudentAttendanceViewScreen;
