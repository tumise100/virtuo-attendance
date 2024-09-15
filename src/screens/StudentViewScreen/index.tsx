import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import ClassCardOverview, {
  OverviewAttendanceStatus,
} from "@/src/components/UI/ClassCardOverview";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DescriptionText,
  Overline1Text,
} from "@/src/theme/typography/OtherText";
import { AttendanceStatusType, StackNavigationProps } from "@/src/shared";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { GetAStudent } from "@/src/services/student";
import { combineStore } from "@/src/store";
import { showToast } from "@/src/components/UI/showToast";
import { IStudentViewDetail } from "@/src/contracts/user";
import { convertLevelStringToNumber } from "@/src/utils";
import moment from "moment";
import {
  ELevel,
  IClassAttendance,
  ICourseWithClasses,
} from "@/src/contracts/course";

interface IStudentAttendance extends IClassAttendance {
  startTime: string;
  endTime: string;
  courseTitle: string;
  courseCode: string;
  courseCreditUnit: number;
  courseLevel: ELevel;
}

const StudentViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [studentViewDetail, setStudentViewDetail] =
    useState<IStudentViewDetail | null>(null);
  const [studentAttendance, setStudentAttendancw] = useState<
    IStudentAttendance[] | null
  >(null);
  const [loadingStudentViewDetail, setLoadingStudentViewDetail] =
    useState(false);

  const { user } = combineStore();

  useEffect(() => {
    // console.log(route);
    if (route && route.params && route.params.studentId) {
      const _studentId = route.params.studentId;
      setStudentId(_studentId);
    }
  }, [route]);

  useEffect(() => {
    if (studentId) {
      fetchStudentViewDetail(studentId);
    }
  }, [studentId]);

  const fetchStudentViewDetail = async (studentId: number) => {
    if (!user) return showToast("No user!");
    setLoadingStudentViewDetail(true);
    console.log({ lecturerId: user.accounts[0].id, studentId }, "details");

    await GetAStudent({ lecturerId: user.accounts[0].id, studentId })
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "fetchStudentViewDetail");
        if (responseStatus === 200) {
          const data: IStudentViewDetail = responseData.data;
          const _attendance = extractEntireAttendanceFromCourses(data.courses);
          setStudentAttendancw(_attendance);
          setStudentViewDetail(data);
        } else {
          // console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoadingStudentViewDetail(false));
  };

  const extractEntireAttendanceFromCourses = (
    coursesWithClasses: ICourseWithClasses[]
  ) => {
    const _studentAttendance: IStudentAttendance[] = [];

    coursesWithClasses.forEach((course) =>
      course.classes.forEach((clasx) =>
        clasx.classAttendance.forEach((attendance) =>
          _studentAttendance.push({
            startTime: clasx.startTime,
            endTime: clasx.endTime,
            courseTitle: course.title,
            courseCode: course.code,
            courseCreditUnit: course.creditUnit,
            courseLevel: course.level,
            ...attendance,
          })
        )
      )
    );
    return _studentAttendance;
  };

  const extractAttendanceRateFromCourse = (
    courseWithClasses: ICourseWithClasses
  ) => {
    let _studentAttendanceRate: { total: number; present: number } = {
      total: 0,
      present: 0,
    };

    courseWithClasses.classes.forEach((clasx, i, arr) => {
      _studentAttendanceRate.present += clasx.classAttendance.filter(
        (attendance) => attendance.attended
      ).length;
      // _studentAttendanceRate.total = arr.length;
      _studentAttendanceRate.total += clasx.classAttendance.filter(
        (cA) => typeof cA.id === "number"
      ).length;
    });

    console.log(
      // JSON.stringify(courseWithClasses),
      _studentAttendanceRate,
      "courseWithClasses to string"
    );

    return _studentAttendanceRate;
  };

  if (loadingStudentViewDetail) {
    return (
      <View className="flex-1 px-4 py-7">
        <LoadingComponent />
      </View>
    );
  }

  if (!studentViewDetail || !studentAttendance)
    return (
      <View className="items-center justify-center flex-1">
        <Text>No Data</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18
          text={`${studentViewDetail.student.firstName} ${
            studentViewDetail.student.lastName
          } (${convertLevelStringToNumber(studentViewDetail.student.level)}L)`}
          customClassName="ml-5"
        />
      </View>
      <View className="flex-row justify-between items-center mt-7">
        <AttendanceCard
          title="Presents"
          // subtitle="120 classes"
          subtitle={`${
            studentAttendance.filter((attendance) => attendance.attended).length
          } classes`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          // subtitle="20 classes"
          subtitle={`${
            studentAttendance.filter((attendance) => !attendance.attended)
              .length
          } classes`}
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Courses"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {studentViewDetail.courses.map((course) => (
          <ClassCardOverview
            showAttendanceStats={false}
            key={course.id}
            courseCode={course.code}
            title={course.title}
            attendanceRate={
              !extractAttendanceRateFromCourse(course).total ||
              !extractAttendanceRateFromCourse(course).present
                ? "0"
                : `${Math.floor(
                    (extractAttendanceRateFromCourse(course).present /
                      extractAttendanceRateFromCourse(course).total) *
                      100
                  )}`
            }
          />
        ))}
      </View>
      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        {studentAttendance?.map((attendance) => (
          <StudentViewAttendanceCard
            key={attendance.id}
            courseCode={attendance.courseCode}
            title={attendance.courseTitle}
            startTime={attendance.startTime}
            endTime={attendance.endTime}
            isPresent={attendance.attended}
          />
        ))}
      </View>
      <View className="h-20" />
    </ScrollView>
  );
};

export default StudentViewScreen;

const StudentViewAttendanceCard = ({
  onPress,
  customclassName,
  title,
  classId = 1,
  courseCode,
  startTime,
  endTime,
  isPresent,
}: {
  title: string;
  onPress?: () => void;
  customclassName?: string;
  classId?: number;
  courseCode: string;
  startTime?: string;
  endTime?: string;
  isPresent?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row rounded-md items-center justify-between bg-white p-3 mb-3 border border-borderColor ${customclassName}`}
    >
      <View className="flex-row items-center">
        <View className="bg-info-500 p-[10px] rounded-full">
          <Ionicons name="trophy" size={19} color={COLORS.white} />
        </View>
        <View className="ml-3">
          <Overline1Text text={title} type={TextFontType.Bold} />
          <DescriptionText
            // text="CMP101 Monday, 15th Mar. (9AM - 12PM)"
            text={`${courseCode} ${moment(startTime).format(
              "dddd, Do MMM."
            )} (${moment(startTime).format("hA")} - ${moment(endTime).format(
              "hA"
            )})`}
            type={TextFontType.Medium}
            customClassName="normal-case text-[9px]"
          />
        </View>
      </View>
      <View className="items-center">
        <OverviewAttendanceStatus
          hideStatsShowOnlyAttendanceStat
          type={
            isPresent
              ? AttendanceStatusType.PRESENT
              : AttendanceStatusType.ABSENT
          }
        />
      </View>
    </TouchableOpacity>
  );
};
