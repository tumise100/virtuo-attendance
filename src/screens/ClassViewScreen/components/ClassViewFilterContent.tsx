import { View } from "react-native";
import React from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { AttendanceStatusType } from "@/src/shared";
import { FilterContentMoreItem, FilterContentRadioItem } from "@/src/components/UI/FilterContentItem/FilterContentItem";

const ClassViewFilterContent = () => {
  return (
    <View className="p-4">
      <BodyText text="Filter Students by" type={TextFontType.Medium} />
      <View>
        <FilterContentRadioItem attendanceType={AttendanceStatusType.PRESENT} />
        <FilterContentRadioItem attendanceType={AttendanceStatusType.ABSENT} />
        <FilterContentMoreItem label="Level" />
        <FilterContentMoreItem label="Department" />
      </View>
    </View>
  );
};

export default ClassViewFilterContent;
