import { View, Text } from "react-native";
import React from "react";
import { BodyRegular, BodySmall } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { OverviewAttendanceStatusType } from "@/src/shared";

const AttendanceCard = ({
  type,
  count = 120,
}: {
  type: OverviewAttendanceStatusType;
  count?: number;
}) => {
  const isPresent = type === OverviewAttendanceStatusType.PRESENT;
  return (
    <View
      className={`p-3 border border-l-[16px] border-success-600 w-[47%] rounded-md ${
        !isPresent && "border-danger-500"
      }`}
    >
      <BodySmall
        text={isPresent ? "Presents" : "Absent"}
        type={TextFontType.Regular}
        customClassName="p-0 m-0"
      />
      <BodyRegular
        text="120 Students"
        type={TextFontType.Semibold}
        customClassName="p-0 m-0 my-1"
      />
    </View>
  );
};

export default AttendanceCard;
