import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Image } from "react-native";
import ProfileAvatarImg from "@/assets/images/profileAvatar.jpg";
import { Feather, Entypo } from "@expo/vector-icons";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { combineStore } from "@/src/store";
import { NoUserDataComponent } from "@/src/components/UI/NoData";

const ProfileScreen = () => {
  const { user } = combineStore();

  if (!user) return <NoUserDataComponent />;

  const account = (user?.accounts as any[])?.[0] as any;
  const staff = account?.staff;
  const school = account?.school;
  const isSchoolUser = account?.type === "SCHOOL";

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    [staff?.firstName, staff?.lastName].filter(Boolean).join(" ") ||
    school?.ownerName ||
    school?.name ||
    "User";

  const displayRole = isSchoolUser
    ? school?.schoolType
      ? `${school.schoolType} School Admin`
      : "School Admin"
    : staff?.designation
      ? `${staff.designation}${staff?.department?.name ? " • " + staff.department.name : ""}`
      : "Staff";

  const displaySchool = school?.name || staff?.school?.name || "";
  const phoneDisplay = (user as any)?.phone || staff?.phone || "—";
  const emailDisplay = user?.email || staff?.email || school?.email || "—";

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Profile" customClassName="ml-5" />
      </View>
      <View className="items-center my-6">
        <CustomAvatar name={displayName} size={105} />
      </View>
      <View className="mt-6">
        <ProfileScreenItem title={displayName} />
        <ProfileScreenItem title={displayRole} customTextClassName="uppercase" hideArrowIcon />
        {displaySchool ? <ProfileScreenItem title={displaySchool} hideArrowIcon /> : null}
        <ProfileScreenItem title={emailDisplay} />
        <ProfileScreenItem title={phoneDisplay} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const ProfileScreenItem = ({
  title,
  customTextClassName,
  hideArrowIcon,
}: {
  title: string;
  customTextClassName?: string;
  hideArrowIcon?: boolean;
}) => {
  return (
    <TouchableOpacity className="flex-row justify-between items-center mb-3">
      <BodyText
        text={title}
        type={TextFontType.Regular}
        customClassName={`text-[15px] normal-case ${customTextClassName}`}
      />
      {!hideArrowIcon && <Entypo name="chevron-right" size={22} />}
    </TouchableOpacity>
  );
};
