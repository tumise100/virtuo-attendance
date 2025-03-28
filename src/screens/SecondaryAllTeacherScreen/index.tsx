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
import { FlatList } from "react-native";
import CustomPagination, {
  handlePaginationItemPress,
  handlePaginationNextPress,
  handlePaginationPrevPress,
} from "@/src/components/UI/Buttons/CustomPagination";

const SecondaryAllTeacherScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const [allTeachers, setAllTeachers] = useState<ILecturerUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  useEffect(() => {
    if (user && user.accounts[0].school?.accountId) {
      fetchAllSchoolTeachers(user.accounts[0].school?.accountId);
      console.log(user.accounts[0].id, "user.accounts[0].id");
    }
  }, [user, currentPage, perPage, searchTerm]);

  const fetchAllSchoolTeachers = async (
    lecturerId: number,
    currentPage?: number,
    perPage?: number,
    searchTerm?: string
  ) => {
    if (!user) return;

    setLoading(true);
    GetAllSchoolTeacher(lecturerId, currentPage, perPage, searchTerm)
      .then(({ responseData, responseStatus }) => {
        console.log(
          JSON.stringify(responseData),
          responseStatus,
          "all teachers"
        );
        // return;
        if (responseStatus === 200) {
          setAllTeachers(responseData.data);
          setTotalCount(responseData.meta.totalCount);
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
      <InputWithFilter
        filterModalRef={filterStudentsByModalRef}
        placeHolder="Search for teachers"
        // value={searchTerm}
        // onChangeText={setSearchTerm}
      />
      <View className="flex-1">
        <AttendanceHistoryButton
          title="Attendance history"
          // onPress={() => navigation.navigate("AttendanceHistoryScreen")}
          onPress={() =>
            navigation.navigate("AttendanceHistoryHeaderForInstructorScreen")
          }
        />
        <View className="flex-row justify-between items-center">
          <BodyText text="Teachers" type={TextFontType.Bold} />
          <BodyText
            // text={`${allTeachers.length || 0}`}
            text={`${totalCount || 0}`}
            type={TextFontType.Bold}
          />
        </View>

        {allTeachers && allTeachers.length ? (
          <>
            <FlatList
              data={allTeachers.slice(0, perPage)}
              renderItem={({ item: teacher, index }) => (
                <StudentOverviewCard
                  hideStatsShowOnlyAttendanceAverage={true}
                  hideStatsShowOnlyAttendanceStat={true}
                  hideTextStats={true}
                  key={teacher.accountId}
                  fullName={`${teacher.firstName} ${teacher.lastName}`}
                  // title={`${teacher.courseId}`}
                  studentId={teacher.accountId}
                  onPress={() =>
                    navigation.navigate("InstructorAttendanceViewScreen", {
                      id: teacher.accountId,
                    })
                  }
                />
              )}
              keyExtractor={(item) => `${item.accountId}`}
              ListFooterComponent={() => <View className="h-36" />}
            />

            <CustomPagination
              currentPage={currentPage}
              numberOfPage={Math.ceil(totalCount / perPage)}
              onNextPress={() =>
                handlePaginationNextPress(
                  currentPage,
                  totalCount,
                  setCurrentPage
                )
              }
              onPressItem={(val) => {
                handlePaginationItemPress(
                  val,
                  Math.ceil(perPage / currentPage),
                  setCurrentPage
                );
              }}
              onPrevPress={() => {
                handlePaginationPrevPress(
                  currentPage,
                  totalCount,
                  setCurrentPage
                );
              }}
            />
          </>
        ) : (
          <Text>No Teacher</Text>
        )}
      </View>
      {/* <FloatingButton title={"Export Teacher"} /> */}
    </View>
  );
};

export default SecondaryAllTeacherScreen;
