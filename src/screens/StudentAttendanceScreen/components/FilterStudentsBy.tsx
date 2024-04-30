import { View, Text } from "react-native";
import React from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import {
  FilterContentMoreItem,
  FilterContentRadioItem,
} from "@/src/components/UI/FilterContentItem/FilterContentItem";
import { AttendanceStatusType } from "@/src/shared";

const FilterStudentsBy = ({
  onPercentagePress,
  onLevelPress,
  onDepartmentPress,
  onCoursesPress,
}: {
  onPercentagePress?: () => void;
  onLevelPress?: () => void;
  onDepartmentPress?: () => void;
  onCoursesPress?: () => void;
}) => {
  return (
    <View className="p-4">
      <BodyText text="Filter Students by" type={TextFontType.Medium} />
      <View>
        <FilterContentRadioItem attendanceType={AttendanceStatusType.PRESENT} />
        <FilterContentRadioItem attendanceType={AttendanceStatusType.ABSENT} />
        <FilterContentMoreItem label="Percentage" onPress={onPercentagePress} />
        <FilterContentMoreItem label="Level" onPress={onLevelPress} />
        <FilterContentMoreItem label="Department" />
        <FilterContentMoreItem label="Courses" />
      </View>
    </View>
  );
};

export default FilterStudentsBy;
