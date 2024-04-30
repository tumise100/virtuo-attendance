import { View, Text } from "react-native";
import React from "react";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import {
  FilterContentCheckboxItem,
  FilterContentMoreItem,
  FilterContentRadioItem,
} from "@/src/components/UI/FilterContentItem/FilterContentItem";
import { AttendanceStatusType } from "@/src/shared";

const FilterStudentsByLevel = () => {
  return (
    <View className="p-4">
      <BodyText text="Filter Students by Level" type={TextFontType.Medium} />
      <View>
        <FilterContentCheckboxItem title="100L" />
        <FilterContentCheckboxItem title="200L" />
        <FilterContentCheckboxItem title="300L" />
        <FilterContentCheckboxItem title="400L" />
        <FilterContentCheckboxItem title="500L" />
      </View>
    </View>
  );
};

export default FilterStudentsByLevel;
