import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import { AttendanceHistoryCard } from "../AttendanceHistoryScreen/components";
import { GetClassDetailOfSecondarySchool } from "@/src/services/class";
import { StackNavigationProps } from "@/src/shared";
import {
  ISecondaryClass,
  ISecondaryClassDetailAttendance,
  ISecondaryClassHeader,
} from "@/src/contracts/course";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import moment from "moment";

const SecondaryClassDetailScreen = ({ route }: StackNavigationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [classItemHeader, setClassItemHeader] =
    useState<ISecondaryClassHeader | null>(null);

  const [classAttendance, setClassAttendance] =
    useState<ISecondaryClassDetailAttendance | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.classItem) {
      const _classItem: ISecondaryClassHeader = route.params.classItem;
      setClassItemHeader(_classItem);
      handleFetchClassDetail({
        classId: _classItem.id,
        schoolId: _classItem.schoolId,
      });
    }
  }, [route]);

  const handleFetchClassDetail = ({
    schoolId,
    classId,
  }: {
    schoolId: number;
    classId: number;
  }) => {
    console.log(schoolId, classId);

    setIsLoading(true);
    GetClassDetailOfSecondarySchool({ classId, schoolId })
      .then(({ responseData, responseStatus }) => {
        if (responseData.data) {
          setClassAttendance(responseData.data);
        }
        console.log(responseData, "class Detail");
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
          text={classItemHeader?.name || ""}
          customClassName="ml-5"
        />
      </View>

      {isLoading ? (
        <View className="p-3 pt-7">
          <LoadingComponent />
          <LoadingComponent />
        </View>
      ) : classAttendance ? (
        <>
          <View className="flex-row justify-between items-center mt-7">
            <AttendanceCard
              title="Class teacher"
              // subtitle={"Mrs Oginni"}
              subtitle={`${
                !classAttendance.teacherSex.length
                  ? ""
                  : classAttendance.teacherSex[0].toLowerCase() === "male"
                  ? "Mr"
                  : "Mrs"
              } ${
                !classAttendance.teacherLastName.length
                  ? "N/A"
                  : classAttendance.teacherLastName[0]
              }`}
              borderColor="border-primary-500"
            />
            <AttendanceCard
              title="Average Attendance"
              // subtitle={"89%"}
              subtitle={"0%"}
              borderColor="border-info-500"
            />
          </View>

          <Text className="my-4">Attendance</Text>
          <ScrollView>
            {classAttendance && classAttendance.attendance.length ? (
              classAttendance.attendance.map((item) => {
                if (item.date.split("T")[0] === moment().format("YYYY-MM-D")) {
                  if (moment().hour() >= 12) {
                    return (
                      <View key={item.date}>
                        <AttendanceHistoryCard item={item} isMorningType />
                        <AttendanceHistoryCard item={item} isAfternoonType />
                      </View>
                    );
                  } else {
                    return (
                      <AttendanceHistoryCard
                        key={item.date + "1"}
                        item={item}
                        isMorningType
                      />
                    );
                  }
                } else if (moment(item.date).isBefore()) {
                  return (
                    <View key={item.date}>
                      <AttendanceHistoryCard item={item} isMorningType />
                      <AttendanceHistoryCard item={item} isAfternoonType />
                    </View>
                  );
                }
              })
            ) : (
              <Text>No Data Yet.</Text>
            )}
            {/* <View>
            </View> */}
          </ScrollView>
        </>
      ) : (
        <View className="p-3 pt-7">
          <Text>No Data Found!</Text>
        </View>
      )}
    </View>
  );
};

export default SecondaryClassDetailScreen;
