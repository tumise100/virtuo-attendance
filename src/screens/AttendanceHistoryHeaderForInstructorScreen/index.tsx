import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import {
  GetSecondaryStudentAttedance,
  GetSecondaryTeacherAttendance,
} from "@/src/services/attendance";
import {
  IStudentAttendanceHeader,
  IStudentAttendanceResp,
} from "@/src/contracts/attendance";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { StackNavigationProps } from "@/src/shared";
import { combineStore } from "@/src/store";
import moment from "moment";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";

const AttendanceHistoryHeaderForInstructorScreen = ({
  navigation,
}: StackNavigationProps) => {
  const [attendanceHistory, setAttendanceHistory] =
    useState<IStudentAttendanceHeader | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = combineStore();
  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";
  const isSchool = user?.accounts[0].school?.accountId;

  useEffect(() => {
    if (user) {
      handleFetchInstructorAttendanceHistory(`${user.accounts[0].id}`);
    }
  }, [user, isSecondaryInstructor, isSchool]);

  const handleFetchInstructorAttendanceHistory = (id: string) => {
    console.log(id, "lecturerId");

    setIsLoading(true);
    GetSecondaryTeacherAttendance({ schoolId: id })
      .then(({ responseData, responseStatus }) => {
        console.log(JSON.stringify(responseData), "classes of school");
        if (responseData.data) {
          // const attendanceHeader = responseData.data;
          // setAttendanceHistory(attendanceHeader);

          const attendanceHeader: IStudentAttendanceResp = responseData.data;

          const obj = {
            dates: attendanceHeader[0],
            ...attendanceHeader[1],
          };

          console.log(obj,'objj');


          setAttendanceHistory(obj as unknown as IStudentAttendanceHeader);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
          text="Attendance history"
          customClassName="ml-5"
        />
      </View>

      {isLoading ? (
        <View className="p-3 pt-7">
          <LoadingComponent />
          <LoadingComponent />
        </View>
      ) : (
        <>
          <View className="flex-row justify-between items-center mt-7">
            <AttendanceCard
              title={`Total Teacher`}
              subtitle={`${attendanceHistory?.totalTeacher}` || "Nill"}
              borderColor="border-primary-500"
            />
            <AttendanceCard
              title="Average Attendance"
              // subtitle={"89%"}
              subtitle={"Nill"}
              borderColor="border-info-500"
            />
          </View>

          <Text className="my-4">Attendance</Text>
          {attendanceHistory && attendanceHistory.dates.length ? (
            <ScrollView>
              {attendanceHistory.dates.map((item) => {
                if (item.date.split("T")[0] === moment().format("YYYY-MM-D")) {
                  if (moment().hour() >= 12) {
                    return (
                      <View key={item.date}>
                        <AttendanceHistoryCard
                          item={item}
                          isMorningType
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
                          item={item}
                          isAfternoonType
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
                  } else {
                    return (
                      <AttendanceHistoryCard
                        key={item.date + "3"}
                        item={item}
                        isMorningType
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
                    );
                  }
                } else if (moment(item.date).isBefore()) {
                  return (
                    <View key={item.date}>
                      <AttendanceHistoryCard
                        item={item}
                        isMorningType
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
                        item={item}
                        isAfternoonType
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
                }
              })}
            </ScrollView>
          ) : (
            <Text>No Attendance found</Text>
          )}
          <FloatingButton
            title={"Mark Attendance"}
            onPress={() =>
              navigation.navigate("AttendanceTakingForInstructorScreen")
            }
          />
        </>
      )}
    </View>
  );
};

export default AttendanceHistoryHeaderForInstructorScreen;
