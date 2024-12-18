import { View, Text, StatusBar } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { GetAllSchoolTeacher } from "@/src/services/teacher";
import { combineStore } from "@/src/store";
import { ILecturerUser } from "@/src/contracts/user";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";
import { FilterModalContext } from "@/src/contexts/modals.context";
import { StackNavigationProps } from "@/src/shared";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { ScrollView } from "react-native";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";

const SecondaryAllTeacherScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const [allTeachers, setAllTeachers] = useState<ILecturerUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  useEffect(() => {
    if (user && user.accounts[0].school?.accountId) {
      fetchAllSchoolTeachers(user.accounts[0].school?.accountId);
      console.log(user.accounts[0].id, "user.accounts[0].id");
    }
  }, [user]);

  const fetchAllSchoolTeachers = async (lecturerId: number) => {
    if (!user) return;

    setLoading(true);
    GetAllSchoolTeacher(lecturerId)
      .then(({ responseData, responseStatus }) => {
        console.log(
          JSON.stringify(responseData),
          responseStatus,
          "all teachers"
        );
        // return;
        if (responseStatus === 200) {
          setAllTeachers(responseData.data);
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
      <View className="flex-1 px-4 py-7 bg-white">
        <LoadingComponent />
        <LoadingComponent />
      </View>
    );
  }

  if (!allTeachers)
    return (
      <View className="bg-white items-center justify-center flex-1">
        <Text>No Data</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Teachers" customClassName="ml-5" />
      </View>
      <InputWithFilter filterModalRef={filterStudentsByModalRef} />
      <View className="flex-1">
        <AttendanceHistoryButton
          title="Attendance history"
          onPress={() => navigation.navigate("AttendanceHistoryScreen")}
        />
        <View className="flex-row justify-between items-center">
          <BodyText text="Teachers" type={TextFontType.Bold} />
          <BodyText
            text={`${allTeachers.length || 0}`}
            type={TextFontType.Bold}
          />
        </View>
        <ScrollView className="flex-1 mt-2">
          {allTeachers && allTeachers.length ? (
            allTeachers.map((student) => (
              <StudentOverviewCard
                hideStatsShowOnlyAttendanceAverage={true}
                hideStatsShowOnlyAttendanceStat={true}
                hideTextStats={true}
                key={student.accountId}
                fullName={`${student.firstName} ${student.lastName}`}
                // title={`${student.courseId}`}
                studentId={student.accountId}
                // level={
                //   isSecondaryInstructor
                //     ? ""
                //     : convertLevelStringToNumber(student.level)
                // }
                // subtitle={
                //   isSecondaryInstructor
                //     ? `${student.class?.name} (${student.department?.name})`
                //     : ""
                // }
              />
            ))
          ) : (
            <Text>No Teacher</Text>
          )}

          <View className="h-20" />
        </ScrollView>
      </View>
      <FloatingButton title={"Export Teacher"} />
    </View>
  );
};

export default SecondaryAllTeacherScreen;
