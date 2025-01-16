import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { FilterModalContext } from "@/src/contexts/modals.context";
import {
  EAttendancePeriod,
  IAttendanceHistoryDetail,
} from "@/src/contracts/attendance.d";
import {
  GetAttendanceHistoryByDate,
  GetAttendanceHistoryByDateForTeacher,
} from "@/src/services/attendance";
import { AttendanceStatusType, StackNavigationProps } from "@/src/shared";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";

const AttendanceHistoryDetailForInstructorScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  const [date, setDate] = useState<string | null>(null);
  const [attendancePeriod, setAttendancePeriod] =
    useState<EAttendancePeriod | null>(null);

  const [loading, setLoading] = useState(false);

  const [attendanceHistoryDetail, setAttendanceHistoryDetail] = useState<
    IAttendanceHistoryDetail[] | null
  >(null);

  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";
  const isSchool = user?.accounts[0].school?.accountId;

  useEffect(() => {
    if (route && route.params && route.params.date && user) {
      const _date = route.params.date;
      setDate(_date);
      setAttendancePeriod(route.params.attendancePeriod);

      handleFetchAttendanceHistoryDetail({
        date: _date,
        id: `${user.accounts[0].id}`,
      });
    }
  }, [route, user, isSchool, isSecondaryInstructor]);

  const handleFetchAttendanceHistoryDetail = ({
    date,
    id,
  }: {
    date: string;
    id: string;
  }) => {
    setLoading(true);
    GetAttendanceHistoryByDateForTeacher({ date, schoolId: id })
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, "responseData");
        setAttendanceHistoryDetail(responseData.data);
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View className="flex-1 px-4 py-7 bg-white">
        <LoadingComponent />
      </View>
    );
  }

  return (
    date && (
      <View className="flex-1 bg-white px-4 pt-7">
        <StatusBar
          backgroundColor={COLORS.white}
          barStyle={"dark-content"}
          animated
        />
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18
            text={moment(date).format("dddd, Do MMMM, YYYY")}
            customClassName="ml-5"
          />
        </View>
        <AttendanceHistoryButton
          title={`${attendancePeriod} Attendance`}
          // leftText="90% avg"
          leftText={`${
            !attendanceHistoryDetail
              ? 0
              : (
                  (attendanceHistoryDetail.reduce(
                    (item, curr) =>
                      attendancePeriod === EAttendancePeriod.Morning
                        ? (item += curr.morningAttendance ? 1 : 0)
                        : (item += curr.afternoonAttendance ? 1 : 0),
                    0
                  ) /
                    attendanceHistoryDetail.length) *
                  100
                ).toFixed(0)
          }% avg`}
          customClassName="mt-5 bg-info-500"
          titleClassName="text-white"
          leftTextClassName="text-white"
        />
        {attendanceHistoryDetail && attendancePeriod ? (
          <View>
            <View className="flex-row justify-between items-center mt-3">
              <AttendanceCard
                title="Presents"
                subtitle={`${attendanceHistoryDetail.reduce(
                  (item, curr) =>
                    attendancePeriod === EAttendancePeriod.Morning
                      ? (item += curr.morningAttendance ? 1 : 0)
                      : (item += curr.afternoonAttendance ? 1 : 0),
                  0
                )}`}
                borderColor="border-success-500"
              />
              <AttendanceCard
                title="Absents"
                subtitle={`${attendanceHistoryDetail.reduce(
                  (item, curr) =>
                    attendancePeriod === EAttendancePeriod.Morning
                      ? (item += curr.morningAttendance ? 0 : 1)
                      : (item += curr.afternoonAttendance ? 0 : 1),
                  0
                )}`}
                borderColor="border-danger-500"
              />
            </View>

            <InputWithFilter
              placeHolder={`Search for Teachers`}
              filterModalRef={filterStudentsByModalRef}
            />

            <View className="flex-row justify-between items-center">
              <BodyText text={"Teacher"} type={TextFontType.Bold} />
              <BodyText
                text={`${attendanceHistoryDetail.length}`}
                type={TextFontType.Bold}
              />
            </View>
            <ScrollView className="mt-2">
              {attendanceHistoryDetail.map((item) => (
                <StudentOverviewCard
                  hideStatsShowOnlyAttendanceStat={true}
                  attendanceStatusType={
                    attendancePeriod === EAttendancePeriod.Morning
                      ? item.morningAttendance
                        ? AttendanceStatusType.PRESENT
                        : AttendanceStatusType.ABSENT
                      : item.afternoonAttendance
                      ? AttendanceStatusType.PRESENT
                      : AttendanceStatusType.ABSENT
                  }
                  fullName={
                    item.lecturer
                      ? `${item.lecturer.lecturer.firstName} ${item.lecturer.lecturer.lastName}`
                      : ""
                  }
                  studentId={item.accountId}
                  // subtitle={"Computer Sci. 100Level"}
                  subtitle={
                    item.lecturer
                      ? `${item.lecturer.lecturer.className || ""}${
                          item.lecturer.lecturer.department?.name
                            ? ` (${item.lecturer.lecturer.department.name})`
                            : ""
                        }`
                      : ""
                  }
                  timeIn={
                    attendancePeriod === EAttendancePeriod.Morning
                      ? item.morningAttendance && item.entryTime
                        ? `Time In: ${moment(item.entryTime).format("hh:mmA")}`
                        : ""
                      : item.afternoonAttendance && item.exitTime
                      ? `Time out: ${moment(item.exitTime).format("hh:mmA")}`
                      : ""
                  }
                  onPress={() => {
                    isSchool &&
                      navigation.navigate("InstructorAttendanceViewScreen", {
                        id: item.accountId,
                      });
                  }}
                  key={item.id}
                />
              ))}

              <View className="h-32" />
            </ScrollView>
          </View>
        ) : (
          <View className="bg-white items-center justify-center flex-1">
            <Text>No Data</Text>
          </View>
        )}
      </View>
    )
  );
};

export default AttendanceHistoryDetailForInstructorScreen;
