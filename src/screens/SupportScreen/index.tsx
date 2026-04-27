import {
  View,
  Text,
  ImageSourcePropType,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import React from "react";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import SocialIcon from "@/assets/images/SocialIcon.png";
import HeadsetIcon from "@/assets/images/headphones.png";
import VLogoIcon from "@/assets/images/Vlogo 1.png";

const SupportScreen = () => {
  return (
    <ScreenContainer>
      <View className="flex-row items-center px-4 mb-6">
        <BackBtn />
        <SubheadingSemibold18 text="Support" customClassName="ml-5 text-gray-900" />
      </View>

      <View className="flex-1 px-4">


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
    </ScreenContainer>
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
