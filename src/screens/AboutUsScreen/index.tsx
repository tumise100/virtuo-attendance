import { View, Text, Linking, TouchableOpacity } from "react-native";
import React from "react";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

const AboutUsScreen = () => {
  return (
    <ScreenContainer>
      <View className="flex-row items-center px-4 mb-6">
        <BackBtn />
        <SubheadingSemibold18 text="About Us" customClassName="ml-5 text-gray-900" />
      </View>

      <View className="flex-1 px-4">


        <Text className="font-normal text-xs leading-5 mt-10">
          At Virtuoservices, we are dedicated to leveraging cutting-edge
          technology to streamline and enhance various business activities, making
          them more accessible, efficient, and secure.
        </Text>

        <View className="mt-14">
          <Text className="font-medium text-[15px] text-[#323335] text-center">
            You can reach out to us on social media
          </Text>
          <View className="flex-row items-center justify-between w-[60%] mx-auto mt-6">
            <Entypo name="facebook" size={26} />

            <FontAwesome5 name="twitter-square" size={26} />
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(
                  "https://www.instagram.com/virtuosphere_"
                );
              }}
            >
              <FontAwesome5 name="instagram-square" size={26} />
            </TouchableOpacity>
            <FontAwesome5 name="linkedin" size={26} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default AboutUsScreen;
