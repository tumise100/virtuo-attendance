import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import {
  AttendanceStatusType,
  ModalProp,
  StackNavigationProps,
  StudentAttendance,
} from "@/src/shared";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import Modal from "@/src/components/UI/Modal";
import { combineStore } from "@/src/store";
import { GetMyStudents, GetTeacherStudents } from "@/src/services/student";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { IStudentItem } from "@/src/contracts/student";
import { convertLevelStringToNumber } from "@/src/utils";
import { FilterModalContext } from "@/src/contexts/modals.context";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";

const AllTeacherScreen = ({ navigation, route }: StackNavigationProps) => {
  const [allStudents, setAllStudents] = useState<IStudentItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  useEffect(() => {
    if (user) {
      fetchAllMyStudents(user.accounts[0].id);
      console.log(user.accounts[0].id, "user.accounts[0].id");
    }
  }, [user, currentPage, perPage, searchTerm]);

  const fetchAllMyStudents = async (
    lecturerId: number,
    currentPage?: number,
    perPage?: number,
    searchTerm?: string
  ) => {
    if (!user) return;

    setLoading(true);
    await (isSecondaryInstructor
      ? GetTeacherStudents(lecturerId)
      : GetMyStudents(lecturerId)
    )
      .then(({ responseData, responseStatus }) => {
        console.log(
          JSON.stringify(responseData),
          responseStatus,
          "all teacher students"
        );
        // return;
        if (responseStatus === 200) {
          setAllStudents(responseData.data);
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
        <SubheadingSemibold18 text="Teachers" customClassName="ml-5" />
      </View>
      <InputWithFilter
        placeHolder="Search for teachers"
        filterModalRef={filterStudentsByModalRef}
      />
      <View className="flex-1">
        <AttendanceHistoryButton
          title="Attendance history"
          onPress={() => navigation.navigate("AttendanceHistoryScreen")}
        />
        <View className="flex-row justify-between items-center">
          <BodyText text="Teachers" type={TextFontType.Bold} />
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
                attendanceStatusType={AttendanceStatusType.PRESENT}
                key={student.id}
                fullName={`${student.student.student.firstName} ${student.student.student.lastName}`}
                // title={`${student.courseId}`}
                studentId={student.student.id}
                level={
                  isSecondaryInstructor
                    ? ""
                    : convertLevelStringToNumber(student.student.student.level)
                }
                subtitle={
                  isSecondaryInstructor
                    ? `${student.student.student.class?.name} (${student.student.student.department?.name})`
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

export default AllTeacherScreen;
