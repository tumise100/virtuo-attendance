import { View, Text, ScrollView, Dimensions } from "react-native";
import React from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { HeadingsSemibold24, TextMedium14 } from "@/src/theme/typography";
import CourseToTakeItem from "./components/CourseToTakeItem";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const { height } = Dimensions.get("screen");
const RegisterCourseToTakeScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <BackBtn />
      <View className="my-6">
        <HeadingsSemibold24 text="Courses taking" />
        <TextMedium14
          text="Which courses are you taking this semester"
          customClassName="text-gray3 font-normal"
        />
      </View>
      <View className="flex-1">
        <ScrollView className="flex-">
          <CourseToTakeItem title="MAT101" subtitle="Descriptive Mathematics" />
          <CourseToTakeItem
            title="CMP101"
            subtitle="Introduction to Computer Science"
          />
          <CourseToTakeItem title="PHY101" subtitle="Introduction to Physics" />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
          <CourseToTakeItem
            title="CHM101"
            subtitle="Introduction to Chemistry"
          />
        </ScrollView>
      </View>
      <View className="pt-3">
        <CustomButton
          title="Continue"
          onPress={() => navigation.navigate("RegistrationCompleteScreen")}
        />
      </View>
    </View>
  );
};

export default RegisterCourseToTakeScreen;
