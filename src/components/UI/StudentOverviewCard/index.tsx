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
import { AttendanceStatusType, StudentAttendance } from "@/src/shared";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { useNavigation } from "@react-navigation/native";
import CustomAvatar from "../CustomAvatar";
import { combineStore } from "@/src/store";

const StudentOverviewCard = ({
  fullName,
  level,
  title,
  hideStatsShowOnlyAttendanceStat,
  hideStatsShowOnlyAttendanceAverage,
  attendanceStatusType,
  studentId,
  subtitle,
  hideTextStats,
  onPress,
}: {
  fullName?: string;
  level?: string;
  title?: string;
  hideStatsShowOnlyAttendanceStat?: boolean;
  hideStatsShowOnlyAttendanceAverage?: boolean;
  hideTextStats?: boolean;
  attendanceStatusType?: AttendanceStatusType;
  studentId: number;
  subtitle?: string;
  onPress?: () => void;
}) => {
  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";

  const isSchool = user?.accounts[0].school?.accountId;

  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress
          ? onPress()
          : navigation.navigate(
              isSecondaryInstructor || isSchool
                ? "SecondaryStudentAttendanceViewScreen"
                : "StudentViewScreen",
              { id: studentId }
            );
      }}
      className="flex-row items-center justify-between mb-3 rounded-md border border-borderColor p-3"
    >
      <View className="flex-row items-center">
        <View className="w-[32px] h-[32px]">
          <Image
            source={UserAvatarImg}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <View className="ml-3">
          <Overline1Text
            text={fullName || "No Name"}
            type={TextFontType.Bold}
          />
          {(level || title) && (
            <DescriptionText
              text={`${title || ""} ${level} Level`}
              type={TextFontType.Bold}
              customClassName="normal-case"
            />
          )}
          {subtitle && (
            <DescriptionText
              text={`${subtitle}`}
              type={TextFontType.Bold}
              customClassName="normal-case"
            />
          )}
        </View>
      </View>
      {hideStatsShowOnlyAttendanceStat && attendanceStatusType ? (
        <OverviewAttendanceStatus
          alt
          hideStatsShowOnlyAttendanceStat
          type={attendanceStatusType}
        />
      ) : hideStatsShowOnlyAttendanceAverage && attendanceStatusType ? (
        <BodyRegular
          text="90% Avg."
          // text=""
          type={TextFontType.Medium}
          customClassName={`mb-1 ${
            attendanceStatusType === AttendanceStatusType.PRESENT
              ? "text-success-600"
              : "text-danger-600"
          }`}
        />
      ) : hideTextStats ? null : (
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
              type={AttendanceStatusType.ABSENT}
              value={"20"}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default StudentOverviewCard;

export const StudentAttendanceMarked = ({
  name,
  matric_no,
  course,
  level,
  id,
}: StudentAttendance) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between mb-3 rounded-md border border-borderColor p-3">
      <View className="flex-row items-center">
        <View className="w-[32px] h-[32px]">
          {/* <Image
            source={UserAvatarImg}
            resizeMode="contain"
            className="w-full h-full"
          /> */}
          <CustomAvatar name={name} size={32} />
        </View>
        <View className="ml-3">
          <Overline1Text
            text={name}
            // text="Salako Mary Jane"
            type={TextFontType.Bold}
          />
          <DescriptionText
            text={`${course}. ${level}Level`}
            // text="Computer Sci. 100Level"
            type={TextFontType.Bold}
            customClassName="normal-case"
          />
        </View>
      </View>
      <Ionicons name="checkmark-circle" size={23} color={COLORS.success[700]} />
    </TouchableOpacity>
  );
};
