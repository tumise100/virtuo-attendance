import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import Image3 from "@/assets/images/image3.png";
import { CustomButton } from "@/src/components/UI/Buttons";
import { StackNavigationProps } from "@/src/shared";

const { width, height } = Dimensions.get("screen");

const OnboardingScreen = ({ navigation }: StackNavigationProps) => {
  return (
    <View className="flex-1">
      <StatusBar
        backgroundColor={COLORS.info[500]}
        barStyle={"light-content"}
        animated
      />
      <View className="h-[65%] w-full bg-info-500 items-center overflow-hidden">
        <View className="w-full h-full items-center">
          <Image
            source={Image3}
            resizeMode="contain"
            style={{ height: height * 0.8 }}
            className="h-[100%] w-[100%] absolute bottom-[-330px]"
            // className="h-[1000px] w-[100%] absolute bottom-[-70px]l"
          />
        </View>
      </View>
      <View className="flex-1 bg-white">
        <View className="mt-8 mb-20">
          <Text className="font-semibold text-[20px] text-center mt-3">
            Welcome to virtuo attendance
          </Text>
        </View>
        <View className="px-5 mt-auto mb-16">
          <CustomButton
            title="Signin"
            onPress={() => navigation.navigate("SignInScreen")}
          />
        </View>
      </View>
      <View></View>
    </View>
  );
};

export default OnboardingScreen;
