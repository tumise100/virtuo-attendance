import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Checkbox } from "react-native-paper";
import {
  ParagraphMediumMedium,
  ParagraphSmallRegular,
} from "@/src/theme/typography";
import { COLORS } from "@/src/theme/colors";

const CourseToTakeItem = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity
      className="flex-row mb-4"
      onPress={() => setIsChecked((p) => !p)}
    >
      <Checkbox
        status={isChecked ? "checked" : "unchecked"}
        uncheckedColor={COLORS.borderColor}
        color={COLORS.primary[500]}
      />
      <View>
        <ParagraphMediumMedium text={title} />
        <ParagraphSmallRegular text={subtitle} customClassName="text-gray3" />
      </View>
    </TouchableOpacity>
  );
};

export default CourseToTakeItem;
