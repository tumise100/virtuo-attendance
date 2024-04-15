import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import UserAvatarImg from "@/assets/images/Avatar.png";
import {
  DescriptionText,
  Overline1Text,
} from "@/src/theme/typography/OtherText";
import { TextFontType } from "@/src/theme/typography/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { OverviewAttendanceStatus } from "../ClassCardOverview";
import { OverviewAttendanceStatusType } from "@/src/shared";

const StudentOverviewCard = ({
  hideStatsShowOnlyAttendanceStat,
  attendanceStatusType,
}: {
  hideStatsShowOnlyAttendanceStat?: boolean;
  attendanceStatusType?: OverviewAttendanceStatusType;
}) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between mb-3 rounded-md border border-borderColor p-3">
      <View className="flex-row items-center">
        <View className="w-[32px] h-[32px]">
          <Image
            source={UserAvatarImg}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="ml-3">
          <Overline1Text text="Salako Mary Jane" type={TextFontType.Bold} />
          <DescriptionText
            text="Computer Sci. 100Level"
            type={TextFontType.Bold}
            customClassName="normal-case"
          />
        </View>
      </View>
      {hideStatsShowOnlyAttendanceStat && attendanceStatusType ? (
        <OverviewAttendanceStatus
          alt
          hideStatsShowOnlyAttendanceStat
          type={attendanceStatusType}
        />
      ) : (
        <View className="">
          <BodyRegular
            text="90% Avg."
            type={TextFontType.Medium}
            customClassName="mb-1"
          />
          <View className="flex-row items-center">
            <OverviewAttendanceStatus alt />
            <OverviewAttendanceStatus
              alt
              type={OverviewAttendanceStatusType.ABSENT}
              value={"20"}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default StudentOverviewCard;
