import {
  View,
  Text,
  StatusBar,
  ImageSourcePropType,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Image } from "react-native";
import SocialIcon from "@/assets/images/SocialIcon.png";
import HeadsetIcon from "@/assets/images/headphones.png";
import VLogoIcon from "@/assets/images/Vlogo 1.png";

const SupportScreen = () => {
  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Support" customClassName="ml-5" />
      </View>

      <View className="mt-10">
        <SupportScreenSocialItem
          source={VLogoIcon}
          title="Message Support"
          subtitle="Hi there, How can I help you today?"
          onPress={() => {
            Linking.openURL("mailto:info@virtuobusiness.com");
          }}
        />
        <SupportScreenSocialItem
          source={SocialIcon}
          subtitle="Chat us on whatsapp"
          onPress={() => {
            Linking.openURL("https://wa.me/+2347064272131");
          }}
        />
        <SupportScreenSocialItem
          source={HeadsetIcon}
          subtitle="Care to speak with us? Call us"
          onPress={() => {
            Linking.openURL("tel:+234 706 427 2131");
          }}
        />
      </View>
    </View>
  );
};

export default SupportScreen;

const SupportScreenSocialItem = ({
  title,
  subtitle,
  source,
  onPress,
}: {
  title?: string;
  subtitle?: string;
  source: ImageSourcePropType;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row p-3 border border-borderColor rounded-md mb-5"
    >
      <Image source={source} className="h-[36px] w-[36px]" />
      <View className="ml-3 justify-center">
        {title && <Text className="font-semibold">{title}</Text>}
        {subtitle && <Text className="text-xs">{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};
