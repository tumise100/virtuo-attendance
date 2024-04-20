import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
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

const CourseViewScreen = ({ navigation }: StackNavigationProps) => {
  const courseSettingsModalRef = useRef<ModalProp>(null);

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
            text="Intro to Computer Sci."
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
            {[1, 2, 3, 4, 5, 5, 6, 7, 3, 2, 2].map((i, _) => (
              <ClassCardOverview key={_} />
            ))}
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
      >
        <CourseSettingsModalContent modalRef={courseSettingsModalRef} />
      </Modal>
    </View>
  );
};

export default CourseViewScreen;
