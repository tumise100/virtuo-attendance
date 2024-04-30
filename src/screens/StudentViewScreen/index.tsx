import { View, Text, ScrollView } from "react-native";
import React from "react";
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

const StudentViewScreen = () => {
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
          text="Salako Mary Jane (100L)"
          customClassName="ml-5"
        />
      </View>
      <View className="flex-row justify-between items-center mt-7">
        <AttendanceCard
          title="Presents"
          subtitle="120 classes"
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle="20 classes"
          borderColor="border-danger-500"
        />
      </View>

      <View>
        <BodyText
          text="Courses"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        <ClassCardOverview showAttendanceStats={false} />
        <ClassCardOverview showAttendanceStats={false} />
      </View>
      <View>
        <BodyText
          text="Attendance"
          type={TextFontType.Bold}
          customClassName="my-4"
        />
        <StudentViewAttendanceCard />
        <StudentViewAttendanceCard />
        <StudentViewAttendanceCard />
        <StudentViewAttendanceCard />
        <StudentViewAttendanceCard />
        <StudentViewAttendanceCard />
      </View>
      <View className="h-20" />
    </ScrollView>
  );
};

export default StudentViewScreen;

const StudentViewAttendanceCard = ({
  onPress,
  customclassName,
}: {
  onPress?: () => void;
  customclassName?: string;
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
          <Overline1Text
            text="Intro. to Computer Science"
            type={TextFontType.Bold}
          />
          <DescriptionText
            text="CMP101 Monday, 15th Mar. (9AM - 12PM)"
            type={TextFontType.Medium}
            customClassName="normal-case text-[9px]"
          />
        </View>
      </View>
      <View className="items-center">
        <OverviewAttendanceStatus hideStatsShowOnlyAttendanceStat />
      </View>
    </TouchableOpacity>
  );
};
