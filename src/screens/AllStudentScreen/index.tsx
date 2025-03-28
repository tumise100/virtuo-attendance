import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { FilterModalContext } from "@/src/contexts/modals.context";
import { IStudentUser } from "@/src/contracts/user";
import { GetSchoolStudents } from "@/src/services/school";
import { GetMyStudents, GetTeacherStudents } from "@/src/services/student";
import { StackNavigationProps } from "@/src/shared";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { convertLevelStringToNumber } from "@/src/utils";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, ScrollView, StatusBar, Text, View } from "react-native";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";
import CustomPagination, {
  handlePaginationItemPress,
  handlePaginationNextPress,
  handlePaginationPrevPress,
} from "@/src/components/UI/Buttons/CustomPagination";
import { showToast } from "@/src/components/UI/showToast";

const AllStudentScreen = ({ navigation, route }: StackNavigationProps) => {
  // const [allStudents, setAllStudents] = useState<IStudentItem[] | null>(null);
  const [allStudents, setAllStudents] = useState<IStudentUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  const { filterStudentsByModalRef } = useContext(FilterModalContext);

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  const isSchoolUser = user?.accounts[0].school?.accountId;

  const isTertiaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "TERTIARY";

  useEffect(() => {
    if (user) {
      fetchAllMyStudents(user.accounts[0].id, currentPage, perPage, searchTerm);
      // console.log(user.accounts[0].id, "user.accounts[0].id");
      console.log(user.accounts[0], "user.accounts[0].id");
    }
  }, [user, currentPage, perPage, searchTerm]);

  const fetchAllMyStudents = async (
    id: number,
    currentPage?: number,
    perPage?: number,
    searchTerm?: string
  ) => {
    if (!user) return;

    setLoading(true);
    await (isSecondaryInstructor
      ? GetTeacherStudents(id, currentPage, perPage, searchTerm)
      : isTertiaryInstructor
      ? GetMyStudents(id, currentPage, perPage, searchTerm)
      : GetSchoolStudents(id, currentPage, perPage, searchTerm)
    )
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) {
          console.log(responseData, "responseData");

          if (isTertiaryInstructor) {
            setAllStudents(
              responseData.data.map((item: any) => ({
                ...item.student.student,
              }))
            );
          } else {
            setAllStudents(responseData.data);
          }

          setTotalCount(responseData.meta.totalCount);
        } else {
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        // showToast(err);
        console.log(err.message, "err");
      })
      .finally(() => setLoading(false));
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
        <SubheadingSemibold18 text="Students" customClassName="ml-5" />
      </View>
      <InputWithFilter
        filterModalRef={filterStudentsByModalRef}
        // value={searchTerm}
        // onChangeText={setSearchTerm}
      />

      {loading ? (
        <View className="flex-1 bg-white">
          <LoadingComponent />
          <LoadingComponent />
        </View>
      ) : !allStudents ? (
        <View className="bg-white items-center justify-center flex-1">
          <Text>No Data</Text>
        </View>
      ) : (
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
              // text={`${allStudents.length || 0}`}
              text={`${totalCount || 0}`}
              type={TextFontType.Bold}
            />
          </View>

          {allStudents && allStudents.length ? (
            <>
              <FlatList
                data={allStudents.slice(0, perPage)}
                renderItem={({ item: student, index }) => (
                  <StudentOverviewCard
                    hideStatsShowOnlyAttendanceAverage={true}
                    hideStatsShowOnlyAttendanceStat={true}
                    hideTextStats={true}
                    key={student.accountId}
                    fullName={`${student.firstName} ${student.lastName}`}
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
            <Text>No Student</Text>
          )}
        </View>
      )}
      {/* <FloatingButton title={"Export Student"} /> */}
    </View>
  );
};

export default AllStudentScreen;
