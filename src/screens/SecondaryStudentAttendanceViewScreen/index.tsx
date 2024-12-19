import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import NoDataComponent from "@/src/components/UI/NoData";
import { showToast } from "@/src/components/UI/showToast";
import { ISecondaryStudentAttendanceDetail } from "@/src/contracts/attendance";
import {
  GetASingleStudentAttendance,
  MarkSecondaryStudentAttedance,
} from "@/src/services/attendance";
import { StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";
import { Feather } from "@expo/vector-icons";

const SecondaryStudentAttendanceViewScreen = ({
  route,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);

  const [studentAttendance, setStudentAttendance] =
    useState<ISecondaryStudentAttendanceDetail | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.studentId) {
      handleFetchStudentAttendance(route.params.studentId);
    }
  }, [route]);

  const handleMarkSecondaryStudentAttendance = (studentId: string) => {
    setLoadingMarkingAttendance(true);
    MarkSecondaryStudentAttedance(studentId)
      .then(({ responseData, responseStatus }) => {
        console.log(responseData);
        if (responseData.accountId) {
          showToast("Student Attendance marked");
          handleFetchStudentAttendance(studentId);
        } else if (!responseData.success) {
          showToast(responseData.message);
        }
      })
      .catch((err) => {
        console.log(err, "mark secondary student");
      })
      .finally(() => {
        setLoadingMarkingAttendance(false);
      });
  };

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
        <SubheadingSemibold18
          text={`${studentAttendance.studentData.firstName} ${studentAttendance.studentData.lastName} (${studentAttendance.studentData.class.name})`}
          customClassName="ml-5"
        />
        <TouchableOpacity
          disabled={loadingMarkingAttendance}
          onPress={() =>
            handleMarkSecondaryStudentAttendance(
              `${studentAttendance.studentData.accountId}`
            )
          }
          className="p-1 ml-auto rounded-md border border-neutral-300"
        >
          {loadingMarkingAttendance ? (
            <ActivityIndicator size={"small"} color={COLORS.black} />
          ) : (
            <Feather name="check" size={19} />
          )}
        </TouchableOpacity>
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
            <View key={item.id}>
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
            </View>
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
