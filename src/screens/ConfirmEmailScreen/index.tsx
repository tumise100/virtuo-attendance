import { View, Text, ScrollView } from "react-native";
import React from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { HeadingsSemibold24, TextMedium14 } from "@/src/theme/typography";
import { CustomVerificationBox } from "@/src/components/UI/Inputs/CustomVerificationBox";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const ConfirmEmailScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <BackBtn />
      <View className="my-6">
        <HeadingsSemibold24 text="Confirm your email address" />
        <TextMedium14
          text="We sent a 6 digits code to sample@virtuo.com"
          customClassName="text-gray3 font-normal"
        />
      </View>
      <CustomVerificationBox />
      <View className="mt-[100%]">
        <CustomButton
          title="Continue"
          onPress={() => navigation.navigate("RegisterCourseToTakeScreen")}
        />
      </View>
    </View>
  );
};

export default ConfirmEmailScreen;
