import { View, Text, StatusBar, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { GetMyStudents } from "@/src/services/student";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import FilterStudentsBy from "./components/FilterStudentsBy";
import FilterStudentsByPercentage from "./components/FilterStudentsByPercentage";
import FilterStudentsByLevel from "./components/FilterStudentsByLevel";
import { IStudentItem } from "@/src/contracts/student";
import { convertLevelStringToNumber } from "@/src/utils";

const AllStudentScreen = ({ route }: StackNavigationProps) => {
  const filterStudentsByModalRef = useRef<ModalProp>(null);
  const filterStudentsByPercentageModalRef = useRef<ModalProp>(null);
  const filterStudentsByLevelModalRef = useRef<ModalProp>(null);

  const [allStudents, setAllStudents] = useState<IStudentItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  useEffect(() => {
    if (user) {
      fetchAllMyStudents(user.accounts[0].id);
      console.log(user.accounts[0].id, "user.accounts[0].id");
    }
  }, [user]);

  const fetchAllMyStudents = async (lecturerId: number) => {
    setLoading(true);
    await GetMyStudents(lecturerId)
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "all courses");
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
        <SubheadingSemibold18 text="Students" customClassName="ml-5" />
      </View>
      <InputWithFilter filterModalRef={filterStudentsByModalRef} />
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <BodyText text="Students" type={TextFontType.Bold} />
          {/* <BodyText text="140" type={TextFontType.Bold} /> */}
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
                attendanceStatusType={AttendanceStatusType.PRESENT}
                key={student.id}
                fullName={`${student.student.student.firstName} ${student.student.student.lastName}`}
                // title={`${student.courseId}`}
                studentId={student.student.id}
                level={convertLevelStringToNumber(
                  student.student.student.level
                )}
              />
            ))
          ) : (
            <Text>No Student</Text>
          )}

          <View className="h-20" />
        </ScrollView>
      </View>
      <FloatingButton title="Export Student" />

      <Modal
        ref={filterStudentsByModalRef}
        onCancel={() => filterStudentsByModalRef.current?.setVisible(false)}
      >
        <FilterStudentsBy
          onPercentagePress={() => {
            filterStudentsByPercentageModalRef.current?.setVisible(true);
            filterStudentsByModalRef.current?.setVisible(false);
          }}
          onLevelPress={() => {
            filterStudentsByLevelModalRef.current?.setVisible(true);
            filterStudentsByModalRef.current?.setVisible(false);
          }}
        />
      </Modal>

      <Modal
        ref={filterStudentsByPercentageModalRef}
        onCancel={() => {
          filterStudentsByPercentageModalRef.current?.setVisible(false);
          //   filterStudentsByModalRef.current?.setVisible(true);
        }}
      >
        <FilterStudentsByPercentage />
      </Modal>

      <Modal
        ref={filterStudentsByLevelModalRef}
        onCancel={() => {
          filterStudentsByLevelModalRef.current?.setVisible(false);
          //   filterStudentsByModalRef.current?.setVisible(true);
        }}
      >
        <FilterStudentsByLevel />
      </Modal>
    </View>
  );
};

export default AllStudentScreen;
