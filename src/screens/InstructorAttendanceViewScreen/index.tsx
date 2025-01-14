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

const InstructorAttendanceViewScreen = ({
  route,
  navigation,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingMarkingAttendance, setLoadingMarkingAttendance] =
    useState(false);

  const [teacherAttendance, setTeacherAttendance] =
    useState<ISecondaryTeacherAttendanceDetail | null>(null);

  const { user } = combineStore();

  const isSchool = user?.accounts[0].school?.accountId;

  useEffect(() => {
    if (route && route.params && route.params.id) {
      handleFetchInstructorAttendance(route.params.id);
    }
  }, [route]);

  const handleMarkInstructorAttendance = (id: string) => {
    setLoadingMarkingAttendance(true);
    MarkSecondaryTeacherAttedance(id)
      .then(({ responseData, responseStatus }) => {
        console.log(responseData);
        if (responseData.accountId) {
          showToast(`Teacher Attendance marked`);
          handleFetchInstructorAttendance(id);
        } else if (!responseData.success) {
          showToast(responseData.message);
        }
      })
      .catch((err) => {
        console.log(err, "mark instructor attendance");
      })
      .finally(() => {
        setLoadingMarkingAttendance(false);
      });
  };

  const handleFetchInstructorAttendance = (id: string) => {
    setLoading(true);
    GetASingleTeacherAttendance(id)
      .then(({ responseData, responseStatus }) => {
        console.log(responseStatus, "responseStatus");

        if (responseData.totalCount || responseStatus == 200) {
          setTeacherAttendance(responseData);
        }
        console.log(responseData, "teacher responseData");
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

  // return studentAttendance ? (
  return teacherAttendance ? (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18
          text={`${teacherAttendance.teacherData?.firstName} ${teacherAttendance.teacherData?.lastName}`}
          customClassName="ml-5"
        />
        <TouchableOpacity
          disabled={loadingMarkingAttendance}
          onPress={() =>
            handleMarkInstructorAttendance(
              `${teacherAttendance?.teacherData?.accountId}`
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
          subtitle={`${teacherAttendance?.totalPresent}`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${teacherAttendance?.totalAbsent}`}
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {teacherAttendance && teacherAttendance.data.length ? (
          teacherAttendance.data.reverse().map((item) => {
            return (
              <View key={item.id}>
                <AttendanceHistoryCard
                  item={{ date: item.date }}
                  isMorningType={true}
                  attended={item.morningAttendance}
                  key={item.id + "1"}
                  showAttendanceStatus
                  alt
                  onPress={() => {
                    navigation.navigate(
                      "AttendanceHistoryDetailForInstructorScreen",
                      {
                        date: item.date,
                        attendancePeriod: "Morning",
                      }
                    );
                  }}
                />
                <AttendanceHistoryCard
                  item={{ date: item.date }}
                  isAfternoonType={true}
                  attended={item.afternoonAttendance}
                  key={item.id + "2"}
                  showAttendanceStatus
                  alt
                  onPress={() => {
                    navigation.navigate(
                      "AttendanceHistoryDetailForInstructorScreen",
                      {
                        date: item.date,
                        attendancePeriod: "Afternoon",
                      }
                    );
                  }}
                />
              </View>
            );
          })
        ) : (
          <Text>No Attendance for this teacher yet</Text>
        )}
      </View>
      <View className="h-20" />
    </ScrollView>
  ) : (
    <NoDataComponent />
  );
};

export default InstructorAttendanceViewScreen;
