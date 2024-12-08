import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { AttendanceHistoryCard } from "./components";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import { GetSecondaryStudentAttedance } from "@/src/services/attendance";
import { IStudentAttendanceHeader } from "@/src/contracts/attendance";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { StackNavigationProps } from "@/src/shared";

const AttendanceHistoryScreen = ({ navigation }: StackNavigationProps) => {
  const [attendanceHistory, setAttendanceHistory] = useState<
    IStudentAttendanceHeader[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchAttendanceHistory();
  }, []);

  const handleFetchAttendanceHistory = () => {
    setIsLoading(true);
    GetSecondaryStudentAttedance()
      .then(({ responseData, responseStatus }) => {
        console.log(JSON.stringify(responseData), "classes of school");
        if (responseData.data) {
          const attendanceHeader = responseData.data;
          setAttendanceHistory(attendanceHeader);
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
              title="Total Students"
              subtitle={"740"}
              borderColor="border-primary-500"
            />
            <AttendanceCard
              title="Average Attendance"
              subtitle={"89%"}
              borderColor="border-info-500"
            />
          </View>

          <Text className="my-4">Attendance</Text>
          {attendanceHistory ? (
            <ScrollView>
              {attendanceHistory.map((item) => {
                if (item.morningAttendance && item.afternoonAttendance) {
                  return (
                    <>
                      <AttendanceHistoryCard
                        key={item.id}
                        item={item}
                        morningAttendance={item.morningAttendance}
                      />
                      <AttendanceHistoryCard
                        key={item.id}
                        item={item}
                        afternoonAttendance={item.afternoonAttendance}
                      />
                    </>
                  );
                } else if (item.morningAttendance) {
                  return (
                    <AttendanceHistoryCard
                      key={item.id}
                      item={item}
                      morningAttendance={item.morningAttendance}
                    />
                  );
                } else if (item.afternoonAttendance) {
                  return (
                    <AttendanceHistoryCard
                      key={item.id}
                      item={item}
                      afternoonAttendance={item.afternoonAttendance}
                    />
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
              navigation.navigate("SecondaryAttendanceTakingScreen")
            }
          />
        </>
      )}
    </View>
  );
};

export default AttendanceHistoryScreen;
