import { View, Text, StatusBar } from "react-native";
import React from "react";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import {
  HeadingsSemibold24,
  InputAssistive,
  TextMedium14,
} from "@/src/theme/typography";
import CustomPaperTextInput from "@/src/components/UI/Inputs/CustomPaperTextInput";
import { CustomButton } from "@/src/components/UI/Buttons";
import { COLORS } from "@/src/theme/colors";
import { StackNavigationProps } from "@/src/shared";

const SignInScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <BackBtn />
      <View className="my-6">
        <HeadingsSemibold24 text="Login to Virtuo Attendance" />
        <TextMedium14
          text="Login with your phone number and password"
          customClassName="text-gray3 font-normal"
        />
        <View className="mt-10">
          <CustomPaperTextInput label="Phone Number" keyboardType="phone-pad" />
          <CustomPaperTextInput label="Password" />
          <InputAssistive
            text="Forgot Password?"
            customClassName="p-0 text-right"
          />
        </View>
        <View className="mt-20">
          <CustomButton
            title="Login"
            onPress={() => navigation.navigate("BaseNavigator")}
          />
          <Text className="text-center">
            Don't have an account?{" "}
            <Text onPress={() => navigation.navigate("SignUpScreen")}>
              Signup
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;
