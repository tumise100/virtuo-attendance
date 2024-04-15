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
import { OverviewAttendanceStatusType } from "@/src/shared";

const ClassCardOverview = ({
  onPress,
  customclassName,
  showAttendanceStats = true,
}: {
  onPress?: () => void;
  customclassName?: string;
  showAttendanceStats?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row rounded-md items-center justify-between bg-info-500 p-3 mb-3 ${customclassName}`}
    >
      <View className="bg-white p-[10px] rounded-full">
        <Ionicons name="trophy" size={19} color={COLORS.primary[500]} />
      </View>
      <View className="mr-2">
        <Overline1Text
          text="Intro. to Computer Science"
          type={TextFontType.Bold}
          customClassName="text-white"
        />
        <DescriptionText
          text="CMP101 Monday, 15th Mar. (9AM - 12PM)"
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
              type={OverviewAttendanceStatusType.ABSENT}
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
  type = OverviewAttendanceStatusType.PRESENT,
  value = "120",
  alt,
  hideStatsShowOnlyAttendanceStat = false,
}: {
  type?: OverviewAttendanceStatusType;
  value?: string;
  alt?: boolean;
  hideStatsShowOnlyAttendanceStat?: boolean;
}) => {
  const isPresent = type === OverviewAttendanceStatusType.PRESENT;

  return (
    <View className="flex-row items-center mr-1">
      <DescriptionText
        text={isPresent ? "P" : "A"}
        type={TextFontType.Regular}
        customClassName={`px-[6px] py-[3px] rounded-full bg-danger-500 mr-[3px] text-white text-[8px] ${
          isPresent && "bg-success-500"
        } ${alt && "text-black"} ${hideStatsShowOnlyAttendanceStat && 'text-[12px] text-white px-[6px] py-[5px]'}`}
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
