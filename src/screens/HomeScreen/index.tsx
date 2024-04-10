import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import UserAvatarImg from "@/assets/images/Avatar.png";
import CustomPaperTextInputWithIcons from "@/src/components/UI/Inputs/CustomPaperTextInputWithIcons";
import { TextInput } from "react-native-paper";
import { COLORS } from "@/src/theme/colors";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import { InputLabelMedium12, TextMedium14 } from "@/src/theme/typography";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import QuickActionCard from "@/src/components/UI/QuickActionCard";

// "name": "virtuo-mobile-app"

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  return (
    <ScrollView className="flex-1 bg-white px-3 pt-2">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={27} />
        </TouchableOpacity>
        <View className="items-center">
          <TextMedium14 text="2022/2023 Session" />
          <InputLabelMedium12 text="semester 1" customClassName="font-normal" />
        </View>
        <View className="w-[48px] h-[48px]">
          <Image
            source={UserAvatarImg}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
      </View>
      <View className="mt-4">
        <CustomPaperTextInputWithIcons
          outerStyle="bg-white border border-gray3"
          innerStyle="bg-white text-sm"
          rightComponent={
            <TextInput.Icon
              icon={() => (
                <Ionicons
                  name="search-outline"
                  color={COLORS.black}
                  size={22}
                />
              )}
            />
          }
          placeholder="Search for student"
        />
      </View>
      <View className="mt-4">
        <Sub2Text
          type={TextFontType.Bold}
          text="Last Class Overview"
          customClassName="mb-2"
        />
        <>
          <ClassCardOverview />
          <ClassCardOverview />
        </>
      </View>
      <View className="mt-3">
        <Sub2Text
          type={TextFontType.Bold}
          text="Quick Action"
          customClassName="mb-2"
        />
        <>
          <View className="flex-row justify-between items-center">
            <QuickActionCard
              title="Courses"
              subtitle="Withdraw money to your bank account instantly"
              color="danger"
            />
            <QuickActionCard
              title="Students"
              subtitle="Scan other users QR Code and pay them instantly"
              color="warning"
            />
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <QuickActionCard title="Profile" subtitle="Send money to different bank accounts instantly" color="info" />
            <QuickActionCard title="Mark Sheet" subtitle="Airtime, Electricity, Cable, Internet, and Betting" color="success" />
          </View>
        </>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
