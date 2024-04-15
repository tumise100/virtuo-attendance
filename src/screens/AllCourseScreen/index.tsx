import { View, Text, ScrollView } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import CourseOverviewCard from "@/src/components/UI/CourseOverviewCard";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const AllCourseScreen = ({navigation}:StackNavigationProps) => {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18 text="Courses" customClassName="ml-5" />
      </View>
      <View className="mt-6">
        <CourseOverviewCard onPress={() => navigation.navigate('CourseViewScreen')} />
        <CourseOverviewCard onPress={() => navigation.navigate('CourseViewScreen')} />
        <CourseOverviewCard onPress={() => navigation.navigate('CourseViewScreen')} />
        <CourseOverviewCard onPress={() => navigation.navigate('CourseViewScreen')} />
        <CourseOverviewCard onPress={() => navigation.navigate('CourseViewScreen')} />
      </View>
      <View className="mt-[60%]">
        <CustomButton title="Add a Course" />
      </View>
    </ScrollView>
  );
};

export default AllCourseScreen;
