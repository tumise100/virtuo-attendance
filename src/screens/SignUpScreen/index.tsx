import { View, Text, ScrollView, StatusBar } from "react-native";
import React from "react";
import { HeadingsSemibold24, TextMedium14 } from "@/src/theme/typography";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { TextInput } from "react-native-paper";
import CustomPaperTextInput from "@/src/components/UI/Inputs/CustomPaperTextInput";
import LecturerPostDropdown from "@/src/components/UI/Dropdown/LecturerPostDropdown";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";

const SignUpScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <BackBtn />
      <View className="my-6">
        <HeadingsSemibold24 text="Lecturer account" />
        <TextMedium14
          text="Fill in your personal details to get started"
          customClassName="text-gray3 font-normal"
        />
      </View>
      <View>
        <CustomPaperTextInput label="Surname" />
        <CustomPaperTextInput label="Given Name" />
        <LecturerPostDropdown placeholder="Post/Status" />
        <CustomPaperTextInput label="Email Address" />
        <CustomPaperTextInput label="Phone Number" />
        <CustomPaperTextInput label="Password" />
      </View>
      <View className="mt-16">
        <CustomButton
          title="Continue"
          onPress={() => navigation.navigate("ConfirmEmailScreen")}
        />
        <View className="items-center">
          <Text className="font-normal text-sm text-gray3 w-[69%] text-center">
            By continuing you accept our
            <Text className="text-textColor"> Terms of service </Text>
            and
            <Text className="text-textColor"> Privacy policy</Text>
          </Text>
        </View>
      </View>
      <View className="h-20" />
    </ScrollView>
  );
};

export default SignUpScreen;
