import { View, Text } from "react-native";
import React from "react";
import { BodyRegular, BodySmall } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { AttendanceStatusType } from "@/src/shared";

const AttendanceCard = ({
  title,
  subtitle,
  borderColor,
}: {
  title: string;
  subtitle: string;
  borderColor: string;
}) => {
  return (
    <View
      className={`p-3 border border-l-[16px] w-[47%] rounded-md bg-white ${borderColor}`}
    >
      <BodySmall
        text={title}
        type={TextFontType.Regular}
        customClassName="p-0 m-0"
      />
      <BodyRegular
        text={subtitle}
        type={TextFontType.Semibold}
        customClassName="p-0 m-0 my-1"
      />
    </View>
  );
};

export default AttendanceCard;
