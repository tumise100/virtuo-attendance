import { View, ScrollView, StatusBar, Image } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { DescriptionText } from "@/src/theme/typography/OtherText";
import { H5Text } from "@/src/theme/typography/HeaderText";
import PhoneWithCardImg from "@/assets/images/phonewithcard.png";
import { CustomButton } from "@/src/components/UI/Buttons";

const NfcAttendanceTakingNotSupported = () => {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18 text="Attendance" customClassName="ml-5" />
        </View>
      </View>
      <BodyRegular
        text="Tap your NFC identity card to mark attendance"
        type={TextFontType.Regular}
        customClassName="my-3 text-gray3"
      />
      <View className="justify-center">
        <View className="justify-center items-center">
          <SubheadingSemibold18 text="Intro to Computer Sci." />
          <DescriptionText
            text="Monday, 15th Mar. (9AM - 12PM)"
            type={TextFontType.Medium}
            customClassName="my-2"
          />
          <View className="w-[208px] h-[287px] my-12">
            <Image
              source={PhoneWithCardImg}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>
          <H5Text
            text="Your phone does not support NFC technology"
            type={TextFontType.Bold}
            customClassName="w-[85%] text-center"
          />
          <BodyRegular
            text="You can also mark attendance by scanning the QR CODE on your student’s card"
            type={TextFontType.Regular}
            customClassName="text-gray3 w-[99%] text-center mt-4"
          />
        </View>
        <CustomButton title="SCAN QR CODE" customClassName="mt-7" />
      </View>
      <View className="h-24" />
    </ScrollView>
  );
};

export default NfcAttendanceTakingNotSupported;
