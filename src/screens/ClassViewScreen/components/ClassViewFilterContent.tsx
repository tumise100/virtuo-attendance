import { View, Text } from "react-native";
import React from "react";
import { BodySmall, BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { AttendanceStatusText } from "@/src/components/UI/ClassCardOverview";
import { AttendanceStatusType } from "@/src/shared";
import { RadioButton } from "react-native-paper";
import { FontAwesome5, Entypo } from "@expo/vector-icons";

const ClassViewFilterContent = () => {
  return (
    <View className="p-4">
      <BodyText text="Filter Students by" type={TextFontType.Medium} />
      <View>
        <ClassViewFilterContentRadioItem
          attendanceType={AttendanceStatusType.PRESENT}
        />
        <ClassViewFilterContentRadioItem
          attendanceType={AttendanceStatusType.ABSENT}
        />
        <ClassViewFilterContentMoreItem
          label="Level"
        />
        <ClassViewFilterContentMoreItem
          label="Department"
        />
      </View>
    </View>
  );
};

export default ClassViewFilterContent;

const ClassViewFilterContentRadioItem = ({
  attendanceType,
}: {
  attendanceType: AttendanceStatusType;
}) => {
  const isPresent = attendanceType === AttendanceStatusType.PRESENT;

  return (
    <View className="flex-row items-center justify-between mb-2">
      <View className="flex-row items-center">
        <AttendanceStatusText type={attendanceType} />
        <BodySmall
          text={`${isPresent ? "Present" : "Absent"} students`}
          type={TextFontType.Regular}
          customClassName="ml-3"
        />
      </View>
      <RadioButton value="" />
    </View>
  );
};

const ClassViewFilterContentMoreItem = ({ label }: { label: string }) => {
  return (
    <View className="flex-row items-center justify-between mb-2 mt-1">
      <View className="flex-row items-center">
        <FontAwesome5 name="building" size={20} />
        <BodySmall
          text={label}
          type={TextFontType.Regular}
          customClassName="ml-3"
        />
      </View>
      <Entypo name="chevron-small-right" size={28} />
    </View>
  );
};
