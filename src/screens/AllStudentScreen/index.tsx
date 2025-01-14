import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { FilterModalContext } from "@/src/contexts/modals.context";
import { IStudentUser } from "@/src/contracts/user";
import { GetSchoolStudents } from "@/src/services/school";
import { GetMyStudents, GetTeacherStudents } from "@/src/services/student";
import {
  StackNavigationProps
} from "@/src/shared";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { convertLevelStringToNumber } from "@/src/utils";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  View
} from "react-native";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";

const AllStudentScreen = ({ navigation, route }: StackNavigationProps) => {
  // const [allStudents, setAllStudents] = useState<IStudentItem[] | null>(null);
  const [allStudents, setAllStudents] = useState<IStudentUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  const isSchoolUser = user?.accounts[0].school?.accountId;

  const isTertiaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "TERTIARY";

  useEffect(() => {
    if (user) {
      fetchAllMyStudents(user.accounts[0].id);
      console.log(user.accounts[0].id, "user.accounts[0].id");
    }
  }, [user]);

  const fetchAllMyStudents = async (id: number) => {
    if (!user) return;

    setLoading(true);
    await (isSecondaryInstructor
      ? GetTeacherStudents(id)
      : isTertiaryInstructor
      ? GetMyStudents(id)
      : GetSchoolStudents(id)
    )
      .then(({ responseData, responseStatus }) => {
        // console.log(
        //   JSON.stringify(responseData),
        //   responseStatus,
        //   "all teacher students"
        // );
        // return;
        if (responseStatus === 200) {
          if (isTertiaryInstructor) {
            setAllStudents(
              responseData.data.map((item: any) => ({
                ...item.student.student,
              }))
            );
          } else {
            setAllStudents(responseData.data);
          }
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

  if (!allStudents)
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
        <SubheadingSemibold18 text="Students" customClassName="ml-5" />
      </View>
      <InputWithFilter filterModalRef={filterStudentsByModalRef} />
      <View className="flex-1">
        {(isSecondaryInstructor || isSchoolUser) && (
          <AttendanceHistoryButton
            title="Attendance history"
            onPress={() => navigation.navigate("AttendanceHistoryScreen")}
          />
        )}
        <View className="flex-row justify-between items-center">
          <BodyText text="Students" type={TextFontType.Bold} />
          <BodyText
            text={`${allStudents.length || 0}`}
            type={TextFontType.Bold}
          />
        </View>
        <ScrollView className="flex-1 mt-2">
          {allStudents && allStudents.length ? (
            allStudents.map((student) => (
              <StudentOverviewCard
                hideStatsShowOnlyAttendanceAverage={true}
                hideStatsShowOnlyAttendanceStat={true}
                hideTextStats={true}
                key={student.accountId}
                fullName={`${student.firstName} ${student.lastName}`}
                // title={`${student.courseId}`}
                studentId={student.accountId}
                level={
                  isSecondaryInstructor
                    ? ""
                    : convertLevelStringToNumber(student.level)
                }
                subtitle={
                  isSecondaryInstructor
                    ? `${student.class?.name} (${student.department?.name})`
                    : ""
                }
              />
            ))
          ) : (
            <Text>No Student</Text>
          )}

          <View className="h-20" />
        </ScrollView>
      </View>
      <FloatingButton title={"Export Student"} />
    </View>
  );
};

export default AllStudentScreen;
