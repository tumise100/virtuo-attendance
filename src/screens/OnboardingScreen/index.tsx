import { View, Text, SafeAreaView, StatusBar, Image } from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import Image3 from "@/assets/images/image3.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const OnboardingScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        backgroundColor={COLORS.info[500]}
        barStyle={"light-content"}
        animated
      />
      <View className="h-[55%] bg-info-500 items-center">
        <View className="w-[230px] h-full items-center">
          <Image
            source={Image3}
            resizeMode="stretch"
            className="h-[100%] w-[100%] absolute bottom-[-120px]"
          />
        </View>
      </View>
      <View className="h-[45%] bg-white">
        <View className="mt-8 mb-20">
          <Text className="font-semibold text-[30px] text-center">
            Welcome to virtuo attendance
          </Text>
        </View>
        <View className="px-5">
          <CustomButton
            title="Signup"
            onPress={() => navigation.navigate("SignUpScreen")}
          />
          <CustomButton title="Signin" outline />
        </View>
      </View>
      <View></View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
