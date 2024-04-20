import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AttendanceStatusType } from "@/src/shared";
import { AttendanceStatusText } from "@/src/components/UI/ClassCardOverview";
import { BodySmall } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { Checkbox, RadioButton } from "react-native-paper";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";

export const FilterContentRadioItem = ({
  title,
  attendanceType,
  onPress,
}: {
  title?: string;
  attendanceType: AttendanceStatusType;
  onPress?: () => void;
}) => {
  const isPresent = attendanceType === AttendanceStatusType.PRESENT;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mb-2"
    >
      <View className="flex-row items-center">
        <AttendanceStatusText type={attendanceType} />
        <BodySmall
          text={`${title ? title : isPresent ? "Present" : "Absent"} students`}
          type={TextFontType.Regular}
          customClassName="ml-3"
        />
      </View>
      <RadioButton value="" />
    </TouchableOpacity>
  );
};

export const FilterContentCheckboxItem = ({
  title,
  onPress,
  attendanceType,
}: {
  title: string;
  onPress?: () => void;
  attendanceType?: AttendanceStatusType;
}) => {
  const isPresent = attendanceType === AttendanceStatusType.PRESENT;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mb-2 mt-1"
    >
      <View className="flex-row items-center">
        {attendanceType ? (
          <AttendanceStatusText type={attendanceType} />
        ) : (
          <FontAwesome5 name="building" size={20} />
        )}

        <BodySmall
          text={title}
          type={TextFontType.Regular}
          customClassName="ml-3 normal-case"
        />
      </View>
      <Checkbox status="unchecked" uncheckedColor={COLORS.gray3} />
    </TouchableOpacity>
  );
};

export const FilterContentMoreItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mb-2 mt-1"
    >
      <View className="flex-row items-center">
        <FontAwesome5 name="building" size={20} />
        <BodySmall
          text={label}
          type={TextFontType.Regular}
          customClassName="ml-3"
        />
      </View>
      <Entypo name="chevron-small-right" size={28} />
    </TouchableOpacity>
  );
};
