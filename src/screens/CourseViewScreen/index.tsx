import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import FloatingButton from "@/src/components/UI/Buttons/FloatingButton";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import Modal from "@/src/components/UI/Modal";
import CourseSettingsModalContent from "./components/CourseSettingsModalContent";
import {
  ICourse,
  ICourseViewDetail,
  ICourseViewDetailClass,
} from "@/src/contracts/course";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { GetACourse } from "@/src/services/courses";

const CourseViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const courseSettingsModalRef = useRef<ModalProp>(null);
  const [courseCode, setCourseCode] = useState<string | null>(null);
  const [course, setCourse] = useState<ICourseViewDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(route);
    if (route && route.params && route.params.courseCode) {
      const _courseCode = route.params.courseCode;
      setCourseCode(_courseCode);
    }
  }, [route]);

  useEffect(() => {
    if (courseCode) {
      fetchCourseViewDetail(courseCode);
    }
  }, [courseCode]);

  const fetchCourseViewDetail = async (courseCode: string) => {
    setLoading(true);
    await GetACourse(courseCode)
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "my course");
        if (responseStatus === 200) {
          setCourse(responseData);
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

  if (!course)
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
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18
            text={`Introduction to ${course?.title}`}
            customClassName="ml-5"
          />
        </View>
        <TouchableOpacity
          onPress={() => courseSettingsModalRef.current?.setVisible(true)}
        >
          <Ionicons name="options-outline" size={24} />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center mt-7">
          <AttendanceCard
            title="Total Students"
            // subtitle="120"
            subtitle={`${course.students.length}`}
            borderColor="border-primary-500"
          />
          <AttendanceCard
            title="Average attendance"
            // subtitle="89%"
            // subtitle={extractEntireAttendanceFromCourse(course)}
            subtitle={
              !extractEntireAttendanceFromCourse(course).total ||
              !extractEntireAttendanceFromCourse(course).present
                ? "0"
                : `${Math.floor(
                    (extractEntireAttendanceFromCourse(course).present /
                      extractEntireAttendanceFromCourse(course).total) *
                      100
                  )}%`
            }
            borderColor="border-blue-500"
          />
        </View>
        <View className="flex-1">
          <BodyText
            text="Classes"
            type={TextFontType.Bold}
            customClassName="my-4"
          />
          <ScrollView className="flex-1">
            {course && course.classes.length ? (
              course.classes.map((courseClass) => (
                <ClassCardOverview
                  key={courseClass.id}
                  title={`Introduction to ${course.title} ${courseClass.id}`}
                  courseCode={course.code}
                  showAttendanceStats={false}
                  attendanceRate={
                    !extractAttendanceRateFromClass(courseClass).total ||
                    !extractAttendanceRateFromClass(courseClass).present
                      ? "0"
                      : `${Math.floor(
                          (extractAttendanceRateFromClass(courseClass).present /
                            extractAttendanceRateFromClass(courseClass).total) *
                            100
                        )}`
                  }
                />
              ))
            ) : (
              <Text>No Data</Text>
            )}
            {/* {[1, 2, 3, 4, 5, 5, 6, 7, 3, 2, 2].map((i, _) => (
              <ClassCardOverview key={_} />
            ))} */}
          </ScrollView>
        </View>
      </View>
      <FloatingButton
        title="New attendance"
        onPress={() =>
          navigation.navigate("AttendanceTakingScreen", { courseId: course.id })
        }
      />

      <Modal
        ref={courseSettingsModalRef}
        onCancel={() => {
          courseSettingsModalRef.current?.setVisible(false);
        }}
        customStyle={{ height: Dimensions.get("screen").height * 0.4 }}
      >
        <CourseSettingsModalContent modalRef={courseSettingsModalRef} />
      </Modal>
    </View>
  );
};

export default CourseViewScreen;

const extractAttendanceRateFromClass = (clasx: ICourseViewDetailClass) => {
  const present = clasx.classAttendance.filter((cA) => cA.attended).length;
  const total = clasx.classAttendance.length;

  return { present, total };
};

const extractEntireAttendanceFromCourse = (course: ICourseViewDetail) => {
  let _courseAttendanceRate: { total: number; present: number } = {
    total: 0,
    present: 0,
  };

  course.classes.forEach((clasx, indx, arr) => {
    clasx.classAttendance.forEach((cA) => {
      if (cA.attended) {
        _courseAttendanceRate.present += 1;
      }
      _courseAttendanceRate.total += 1;
    });
  });

  return _courseAttendanceRate;
};
