import { View, StatusBar, ScrollView, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import {
  ModalProp,
  AttendanceStatusType,
  StackNavigationProps,
} from "@/src/shared";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import Modal from "@/src/components/UI/Modal";
import ClassViewFilterContent from "./components/ClassViewFilterContent";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import { IClassDetail, ICourse } from "@/src/contracts/course";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { GetAClass } from "@/src/services/courses";
import { convertLevelStringToNumber } from "@/src/utils";
import moment from "moment";

const ClassViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const classViewFilterModalRef = useRef<ModalProp>(null);
  const [classId, setClassId] = useState<number | null>(null);
  // const [course, setCourse] = useState<ICourse | null>(null);
  const [classViewDetail, setClassViewDetail] = useState<IClassDetail | null>(
    null
  );
  const [loadingClassViewDetail, setLoadingClassViewDetail] = useState(false);
  // const { user } = combineStore();

  useEffect(() => {
    console.log(route);
    if (route && route.params && route.params.classId) {
      const _classId = route.params.classId;
      setClassId(_classId);
    }
  }, [route]);

  useEffect(() => {
    if (classId) {
      fetchClassViewDetail(classId);
    }
  }, [classId]);

  const fetchClassViewDetail = async (classId: number) => {
    console.log(classId, "classId");

    setLoadingClassViewDetail(true);
    await GetAClass(classId)
      .then(({ responseData, responseStatus }) => {
        console.log(
          // JSON.stringify(responseData),
          responseStatus,
          responseData,
          "fetchClassViewDetail"
        );
        if (responseStatus === 200) {
          // return;
          setClassViewDetail(responseData);
        } else {
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoadingClassViewDetail(false));
  };

  if (loadingClassViewDetail) {
    return (
      <View className="flex-1 px-4 py-7">
        <LoadingComponent />
      </View>
    );
  }

  if (!classViewDetail)
    return (
      <View className="items-center justify-center flex-1">
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
      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18
          text={classViewDetail.course.title}
          customClassName="ml-5"
        />
      </View>
      <View className="flex-1">
        <ClassCardOverview
          showAttendanceStats={false}
          showAttendanceAvg={false}
          customclassName="mt-6"
          title={classViewDetail.course.title}
          courseCode={classViewDetail.course.code}
          endTime={classViewDetail.endTime}
          startTime={classViewDetail.startTime}
        />

        <View className="flex-row justify-between items-center mt-2">
          <AttendanceCard
            title="Present"
            subtitle={`${classViewDetail.course.students.length}`}
            borderColor="border-success-600"
          />
          <AttendanceCard
            title="Absent"
            subtitle="0 students"
            borderColor="border-danger-500"
          />
        </View>

        <InputWithFilter filterModalRef={classViewFilterModalRef} />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <BodyText text="Students" type={TextFontType.Bold} />
            <BodyText
              text={`${classViewDetail.course.students.length}`}
              type={TextFontType.Bold}
            />
          </View>
          <ScrollView className="flex-1">
            {classViewDetail.course.students.map((student) => (
              <StudentOverviewCard
                hideStatsShowOnlyAttendanceStat={true}
                attendanceStatusType={AttendanceStatusType.PRESENT}
                key={student.id}
                fullName={`${student.student.student.firstName} ${student.student.student.lastName}`}
                title={classViewDetail.course.title}
                level={convertLevelStringToNumber(classViewDetail.course.level)}
                studentId={student.student.id}
              />
            ))}
            <View className="h-20" />
          </ScrollView>
        </View>
      </View>
      {/* <FloatingButton title="Export attendance" /> */}
      <FloatingButton
        // title={
        //   moment(classViewDetail.endTime).isBefore()
        //     ? "Export attendance"
        //     : `Mark Attendance`
        // }
        title="Mark Attendance"
        onPress={() =>
          navigation.navigate("AttendanceTakingScreen", {
            courseId: classViewDetail.courseId,
            classId: classViewDetail.id,
          })
        }
      />

      <Modal
        ref={classViewFilterModalRef}
        onCancel={() => classViewFilterModalRef.current?.setVisible(false)}
      >
        <ClassViewFilterContent />
      </Modal>
    </View>
  );
};

export default ClassViewScreen;
