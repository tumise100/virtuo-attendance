import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import UserAvatarImg from "@/assets/images/Avatar.png";
import CustomPaperTextInputWithIcons from "@/src/components/UI/Inputs/CustomPaperTextInputWithIcons";
import { TextInput } from "react-native-paper";
import { COLORS } from "@/src/theme/colors";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import { InputLabelMedium12, TextMedium14 } from "@/src/theme/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import QuickActionCard from "@/src/components/UI/QuickActionCard";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { combineStore } from "@/src/store";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { GetACourse, GetAllStudents } from "@/src/services/auth";
import { IClass, ICourse } from "@/src/contracts/course";
import { showToast } from "@/src/components/UI/showToast";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { IStudent } from "@/src/contracts/user";

// "name": "virtuo-mobile-app"

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  const [recentClass, setRecentClass] = useState<IClass[] | null>(null);
  const [allStudents, setAllStudents] = useState<IStudent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAllStudent, setLoadingAllStudent] = useState(false);

  const { user } = combineStore();

  useEffect(() => {
    fetchSingleCourse();
    fetchAllStudents();
  }, []);

  const fetchSingleCourse = async () => {
    setLoading(true);
    await GetACourse("BIO101")
      .then(({ responseData, responseStatus }) => {
        // console.log(responseData, responseStatus, "ee");
        if (responseStatus === 200) {
          setRecentClass(responseData.classes);
          // console.log(responseData.classes, "here");
        } else {
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoading(false));
  };

  const fetchAllStudents = async () => {
    setLoadingAllStudent(true);
    await GetAllStudents()
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "some student ");
        if (responseStatus === 200) {
          setAllStudents(responseData.data);
        } else {
          showToast("Some went wrong!");
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoadingAllStudent(false));
  };

  return (
    <ScrollView className="flex-1 bg-white px-3 pt-2">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={27} />
        </TouchableOpacity>
        <View className="items-center">
          <TextMedium14 text="2022/2023 Session" />
          <InputLabelMedium12 text="semester 1" customClassName="font-normal" />
        </View>
        <CustomAvatar
          size={48}
          name={`${user?.firstName} ${user?.lastName}`}
          onPress={() => navigation.navigate("ProfileScreen")}
        />
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("ProfileScreen")}
          className="w-[48px] h-[48px]"
        >
          <Image
            source={UserAvatarImg}
            resizeMode="contain"
            className="w-full h-full"
          />
        </TouchableOpacity> */}
      </View>
      <View className="mt-4">
        <CustomPaperTextInputWithIcons
          outerStyle="bg-white border border-borderColor"
          innerStyle="bg-white text-sm"
          rightComponent={
            <TextInput.Icon
              icon={() => (
                <Ionicons
                  name="search-outline"
                  color={COLORS.black}
                  size={22}
                />
              )}
            />
          }
          placeholder="Search for student"
        />
      </View>
      <View className="mt-4">
        <Sub2Text
          type={TextFontType.Bold}
          text="Last Class Overview"
          customClassName="mb-2"
        />
        {loading ? (
          <LoadingComponent />
        ) : recentClass && recentClass.length ? (
          recentClass.map((classItem) => (
            <ClassCardOverview
              key={classItem.id}
              title={`Introduction to Biology ${classItem.id}`}
            />
          ))
        ) : (
          <Text>No Data</Text>
        )}
      </View>
      <View className="mt-3">
        <Sub2Text
          type={TextFontType.Bold}
          text="Quick Action"
          customClassName="mb-2"
        />
        <>
          <View className="flex-row justify-between items-center">
            <QuickActionCard
              onPress={() => navigation.navigate("AllCourseScreen")}
              title="Courses"
              subtitle="List of courses you take and attendance list"
              colorType="danger"
            />
            <QuickActionCard
              title="Students"
              subtitle="List of student taking your course"
              colorType="warning"
            />
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <QuickActionCard
              title="Profile"
              subtitle="Update your profile and sessions"
              colorType="info"
            />
            <QuickActionCard
              title="Mark Sheet"
              subtitle="Export mark sheets of students"
              colorType="success"
            />
          </View>
        </>
      </View>

      <View className="my-3">
        <Sub2Text
          type={TextFontType.Bold}
          text="Top Students"
          customClassName="mb-2"
        />
        <View>
          {loadingAllStudent ? (
            <LoadingComponent />
          ) : allStudents && allStudents.length ? (
            allStudents.map(
              ({ id, student: { firstName, lastName, level } }) => (
                <StudentOverviewCard
                  key={id}
                  fullName={`${firstName} ${lastName}`}
                  // level={`${level}`}
                />
              )
            )
          ) : (
            <Text>No Data</Text>
          )}
          {/* <StudentOverviewCard />
          <StudentOverviewCard />
          <StudentOverviewCard /> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
