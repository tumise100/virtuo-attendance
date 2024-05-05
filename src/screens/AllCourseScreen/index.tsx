import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import CourseOverviewCard from "@/src/components/UI/CourseOverviewCard";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";
import { ILecturerCourseHeader } from "@/src/contracts/course";
import { GetMyCourses } from "@/src/services/auth";
import { combineStore } from "@/src/store";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

const AllCourseScreen = ({ navigation }: StackNavigationProps) => {
  const [allMyCourses, setAllMyCourses] = useState<
    ILecturerCourseHeader[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  useEffect(() => {
    fetchAllMyCourses();
  }, []);

  const fetchAllMyCourses = async () => {
    if (user) {
      setLoading(true);
      await GetMyCourses(user.id)
        .then(({ responseData, responseStatus }) => {
          console.log(responseData, responseStatus, "all courses");
          if (responseStatus === 200) {
            setAllMyCourses(responseData);
          } else {
            console.log(responseData, "some data 2");
          }
        })
        .catch((err) => {
          console.log(err, "err");
        })
        .finally(() => setLoading(false));
    }
  };

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
        {loading ? (
          <LoadingComponent />
        ) : allMyCourses && allMyCourses.length ? (
          allMyCourses.map((myCourse) => (
            <CourseOverviewCard
              key={myCourse.id}
              title={myCourse.course.title}
              code={myCourse.course.code}
            />
          ))
        ) : (
          <Text>No Data</Text>
        )}
      </View>
      <View className="mt-[60%]">
        <CustomButton title="Add a Course" />
      </View>
    </ScrollView>
  );
};

export default AllCourseScreen;
