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

const ProfileScreen = () => {
  const { user } = combineStore();

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
        <CustomAvatar
          name={`${user?.firstName} ${user?.lastName}`}
          size={105}
        />
        {/* <View className="w-[105px] h-[105px] rounded-full border-[3px] border-black">
          <Image
            source={ProfileAvatarImg}
            className="h-full w-full rounded-full"
          />
          <View className="absolute p-2 rounded-full bg-borderColor bottom-0 right-0">
            <Feather name="camera" size={17} />
          </View>
        </View> */}
      </View>
      <View className="mt-6">
        <ProfileScreenItem title={`${user?.firstName} ${user?.lastName}`} />
        <ProfileScreenItem title="Nigeria" />
        <ProfileScreenItem title={`${user?.email}`} />
        <ProfileScreenItem title="+234 810 123 4567" />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const ProfileScreenItem = ({ title }: { title: string }) => {
  return (
    <TouchableOpacity className="flex-row justify-between items-center mb-3">
      <BodyText
        text={title}
        type={TextFontType.Regular}
        customClassName="text-[15px]"
      />
      <Entypo name="chevron-right" size={22} />
    </TouchableOpacity>
  );
};
