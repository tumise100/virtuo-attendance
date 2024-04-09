import { View, Text } from "react-native";
import React from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { Image } from "react-native";
import CelebrateImg from "@/assets/images/celebrate.png";
import { TextMedium16 } from "@/src/theme/typography";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const RegistrationCompleteScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <BackBtn />
      <View className="items-center mt-[50%]">
        <Image source={CelebrateImg} className="w-[186px] h-[186px]" />
        <TextMedium16
          text="All set, start managing students and attendance"
          customClassName="text-center mt-5 w-[70%]"
        />
      </View>
      <View className="mt-[50%]">
        <CustomButton
          title="Continue"
          onPress={() => navigation.navigate("SignInScreen")}
        />
      </View>
    </View>
  );
};

export default RegistrationCompleteScreen;
