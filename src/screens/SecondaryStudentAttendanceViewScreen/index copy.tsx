import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import NoDataComponent from "@/src/components/UI/NoData";
import { showToast } from "@/src/components/UI/showToast";
import {
  ISecondaryStudentAttendanceDetail,
  ISecondaryTeacherAttendanceDetail,
} from "@/src/contracts/attendance";
import {
  GetASingleStudentAttendance,
  GetASingleTeacherAttendance,
  MarkSecondaryStudentAttedance,
  MarkSecondaryTeacherAttedance,
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";
import { Feather } from "@expo/vector-icons";
import { combineStore } from "@/src/store";

const SecondaryStudentAttendanceViewScreen = ({
  route,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);

  const [studentAttendance, setStudentAttendance] =
    useState<ISecondaryStudentAttendanceDetail | null>(null);
  const [teacherAttendance, setTeacherAttendance] =
    useState<ISecondaryTeacherAttendanceDetail | null>(null);

  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  const isSchool = user?.accounts[0].school?.accountId;

  useEffect(() => {
    if (route && route.params && route.params.id) {
      handleFetchStudentAttendance(route.params.id);
    }
  }, [route]);

  const handleMarkSecondaryStudentAttendance = (id: string) => {
    setLoadingMarkingAttendance(true);
    (isSchool
      ? MarkSecondaryTeacherAttedance(id)
      : MarkSecondaryStudentAttedance(id)
    )
      .then(({ responseData, responseStatus }) => {
        console.log(responseData);
        if (responseData.accountId) {
          showToast(`${isSchool ? "Teacher" : "Student"} Attendance marked`);
          handleFetchStudentAttendance(id);
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

  const handleFetchStudentAttendance = (id: string) => {
    setLoading(true);
    // (isSchool
    //   ? GetASingleTeacherAttendance(id)
    //   : GetASingleStudentAttendance(id)
    // )
    GetASingleStudentAttendance(id)
      .then(({ responseData, responseStatus }) => {
        console.log(responseStatus, "responseStatus");

        if (responseData.totalCount || responseStatus == 200) {
          if (isSchool) {
            setTeacherAttendance(responseData);
          } else {
            setStudentAttendance(responseData);
          }
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

  if (!studentAttendance?.attendancedata) {
    return <NoDataComponent />;
  }

  // return studentAttendance ? (
  return studentAttendance || teacherAttendance ? (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18
          text={
            studentAttendance
              ? `${studentAttendance.studentData?.firstName} ${studentAttendance.studentData?.lastName} (${studentAttendance.studentData?.class.name})`
              : teacherAttendance
              ? `${teacherAttendance.teacherData?.firstName} ${teacherAttendance.teacherData?.lastName}`
              : ""
          }
          customClassName="ml-5"
        />
        <TouchableOpacity
          disabled={loadingMarkingAttendance}
          onPress={() =>
            handleMarkSecondaryStudentAttendance(
              `${
                isSchool
                  ? teacherAttendance?.teacherData?.accountId
                  : studentAttendance?.studentData?.accountId
              }`
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
          subtitle={`${
            studentAttendance
              ? studentAttendance.totalPresent
              : teacherAttendance?.totalPresent
          }`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${
            studentAttendance?.totalAbsent || teacherAttendance?.totalAbsent
          }`}
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {studentAttendance
          ? studentAttendance.attendancedata.map((item) => {
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
            })
          : teacherAttendance &&
            teacherAttendance.data.map((item) => {
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
