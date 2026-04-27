import React, { useEffect } from "react";
import { View, Image, StatusBar } from "react-native";
import VlogoImg from "@/assets/images/Vlogo1.png";
import { StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";

const SPLASH_DURATION_MS = 1800;

const SplashScreen = ({ navigation }: StackNavigationProps) => {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace("OnboardingScreen");
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Image
        source={VlogoImg}
        resizeMode="contain"
        style={{ width: 180, height: 180 }}
      />
    </View>
  );
};

export default SplashScreen;
