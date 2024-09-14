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
import { ICourse } from "@/src/contracts/course";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { GetACourse } from "@/src/services/courses";

const CourseViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const courseSettingsModalRef = useRef<ModalProp>(null);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(route);
  }, [route]);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    setLoading(true);
    await GetACourse("BIO101")
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
      <View className="flex-1 px-4 py-7">
        <LoadingComponent />
      </View>
    );
  }

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
            subtitle="120"
            borderColor="border-primary-500"
          />
          <AttendanceCard
            title="Average attendance"
            subtitle="89%"
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
              course.classes.map(
                (courseClass) =>
                  null
                  // <ClassCardOverview
                  //   key={courseClass.id}
                  //   title={`Introduction to ${course.title} ${courseClass.id}`}
                  // />
              )
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
        onPress={() => navigation.navigate("AttendanceTakingScreen")}
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
