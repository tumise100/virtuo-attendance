import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  DescriptionText,
  Overline1Text,
} from "@/src/theme/typography/OtherText";
import { TextFontType } from "@/src/theme/typography/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { COLORS } from "@/src/theme/colors";
import { AttendanceStatusType } from "@/src/shared";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const ClassCardOverview = ({
  onPress,
  customclassName,
  showAttendanceStats = true,
  title,
  classId = 1,
  courseCode,
  startTime,
  endTime,
}: {
  title?: string;
  onPress?: () => void;
  customclassName?: string;
  showAttendanceStats?: boolean;
  classId?: number;
  courseCode: string;
  startTime: string;
  endTime: string;
}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ClassViewScreen", { classId });
      }}
      // onPress={onPress}
      className={`flex-row rounded-md items-center justify-between bg-info-500 p-3 mb-3 ${customclassName}`}
    >
      <View className="bg-white p-[10px] rounded-full">
        <Ionicons name="trophy" size={19} color={COLORS.primary[500]} />
      </View>
      <View className="mr-2 ml-1 flex-1">
        <Overline1Text
          text={title || "Intro. to Computer Science"}
          type={TextFontType.Bold}
          customClassName="text-white"
        />
        <DescriptionText
          // text="CMP101 Monday, 15th Mar. (9AM - 12PM)"
          text={`${courseCode} ${moment(startTime).format(
            "dddd, Do MMM."
          )} (${moment(startTime).format("hA")} - ${moment(endTime).format(
            "hA"
          )})`}
          type={TextFontType.Bold}
          customClassName="text-white normal-case text-[9px]"
        />
      </View>
      <View className="items-center">
        <BodyRegular
          text="90% Avg."
          type={TextFontType.Medium}
          customClassName="text-white mb-1"
        />
        {showAttendanceStats ? (
          <View className="flex-row items-center">
            <OverviewAttendanceStatus />
            <OverviewAttendanceStatus
              type={AttendanceStatusType.ABSENT}
              value={"20"}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ClassCardOverview;

export const OverviewAttendanceStatus = ({
  type = AttendanceStatusType.PRESENT,
  value = "120",
  alt,
  hideStatsShowOnlyAttendanceStat = false,
}: {
  type?: AttendanceStatusType;
  value?: string;
  alt?: boolean;
  hideStatsShowOnlyAttendanceStat?: boolean;
}) => {
  const isPresent = type === AttendanceStatusType.PRESENT;

  return (
    <View className="flex-row items-center mr-1">
      <DescriptionText
        text={isPresent ? "P" : "A"}
        type={TextFontType.Regular}
        customClassName={`px-[6px] py-[3px] rounded-full bg-danger-500 mr-[3px] text-white text-[8px] ${
          isPresent && "bg-success-500"
        } ${alt && "text-black"} ${
          hideStatsShowOnlyAttendanceStat &&
          "text-[12px] text-white px-[6px] py-[4px]"
        }`}
      />
      {!hideStatsShowOnlyAttendanceStat && (
        <DescriptionText
          text={value}
          type={TextFontType.Regular}
          customClassName={`text-white text-[9px] ${alt && "text-black"}`}
        />
      )}
    </View>
  );
};

export const AttendanceStatusText = ({
  type,
}: {
  type: AttendanceStatusType;
}) => {
  const isPresent = type === AttendanceStatusType.PRESENT;
  return (
    <View className="flex-row">
      <Text
        className={`text-[12px] text-white px-[7px] py-[3px] rounded-full ${
          isPresent ? "bg-success-600" : "bg-danger-600"
        }`}
      >
        {isPresent ? "P" : "A"}
      </Text>
    </View>
  );
};
