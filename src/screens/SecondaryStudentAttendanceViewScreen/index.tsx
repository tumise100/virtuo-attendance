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
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
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
  navigation,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);

  const [studentAttendance, setStudentAttendance] =
    useState<ISecondaryStudentAttendanceDetail | null>(null);

  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  const isSchool = user?.accounts[0].school?.accountId;

  const studentId = route?.params?.id;

  const handleFetchStudentAttendance = (id: string) => {
    if (!id) return;
    setLoading(true);
    GetASingleStudentAttendance(id)
      .then(({ responseData, responseStatus }) => {
        if (responseStatus !== 200) return;
        const records = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        
        if (records.length === 0) {
          setStudentAttendance({ attendancedata: [] } as any);
          return;
        }

        const student = records[0]?.student;
        
        // Group by date
        const groupedMap = new Map<string, any>();
        
        records.forEach((item: any) => {
          const dateKey = moment(item.date).format("YYYY-MM-DD");
          if (!groupedMap.has(dateKey)) {
            groupedMap.set(dateKey, {
              date: item.date,
              morningAttendance: false,
              afternoonAttendance: false,
              id: item.id,
            });
          }
          const entry = groupedMap.get(dateKey);
          if (item.sessionType === "MORNING") {
            entry.morningAttendance = item.status === "PRESENT";
          } else if (item.sessionType === "AFTERNOON") {
            entry.afternoonAttendance = item.status === "PRESENT";
          }
        });

        const mapped = {
          studentData: student
            ? {
              accountId: student.id,
              firstName: student.firstName || "",
              lastName: student.lastName || "",
              class: { name: student.currentClass?.name || student.class?.name || "" },
            }
            : undefined,
          attendancedata: Array.from(groupedMap.values()).sort((a, b) => 
            moment(b.date).diff(moment(a.date))
          ),
          totalCount: records.length,
          totalPresent: records.filter((r: any) => r.status === "PRESENT").length,
          totalAbsent: records.filter((r: any) => r.status !== "PRESENT").length,
        };
        setStudentAttendance(mapped as any);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMarkSecondaryStudentAttendance = (id: string) => {
    setLoadingMarkingAttendance(true);
    MarkSecondaryStudentAttedance(id)
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200 || responseStatus === 201) {
          showToast(`Student Attendance marked`);
          handleFetchStudentAttendance(id);
        } else {
          showToast(responseData?.message || "Attendance marking failed");
        }
      })
      .catch((err) => {
        console.log(err, "mark secondary student");
      })
      .finally(() => {
        setLoadingMarkingAttendance(false);
      });
  };

  useEffect(() => {
    if (studentId) {
      handleFetchStudentAttendance(studentId);
    }
  }, [studentId]);

  useFocusEffect(
    React.useCallback(() => {
      if (studentId) {
        handleFetchStudentAttendance(studentId);
      }
    }, [studentId])
  );

  // Force refresh on focus
  const { addListener } = navigation as any;
  useEffect(() => {
    const unsubscribe = addListener('focus', () => {
      if (studentId) handleFetchStudentAttendance(studentId);
    });
    return unsubscribe;
  }, [addListener, studentId]);

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
          text={
            studentAttendance
              ? // ? `${studentAttendance.studentData?.firstName} ${studentAttendance.studentData?.lastName} (${studentAttendance.studentData?.class?.name})`
                `${studentAttendance.studentData?.firstName} ${
                  studentAttendance.studentData?.lastName
                } ${
                  studentAttendance.studentData?.class?.name
                    ? `(${studentAttendance.studentData?.class?.name})`
                    : ""
                }`
              : ""
          }
          customClassName="ml-5"
        />
        {isSchool ? null : (
          <TouchableOpacity
            disabled={loadingMarkingAttendance}
            onPress={() =>
              handleMarkSecondaryStudentAttendance(
                `${studentAttendance?.studentData?.accountId}`
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
        )}
      </View>
      <View className="flex-row justify-between items-center mt-7">
        <AttendanceCard
          title="Presents"
          subtitle={`${studentAttendance.totalPresent}`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${studentAttendance?.totalAbsent}`}
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {studentAttendance &&
          studentAttendance.attendancedata.map((item) => {
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
