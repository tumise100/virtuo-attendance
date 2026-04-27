import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import NoDataImg from "@/assets/images/NoDataImg.png";
import { BodyRegular, BodySmall } from "../../../theme/typography/BodyText";
import { TextFontType } from "../../../theme/typography/typography";
import { CustomButton } from "../Buttons";

const NoDataComponent = ({
  title = "No Data Found",
  subtitle = "Looks like there's nothing to show here yet.",
  onRefresh,
}: {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
}) => {
  return (
    <View className="flex-1 bg-white items-center justify-center p-8">
      <Image
        source={NoDataImg}
        style={{ width: 220, height: 220 }}
        resizeMode="contain"
      />
      <View className="mt-6 items-center">
        <BodyRegular
          text={title}
          type={TextFontType.Bold}
          customClassName="text-gray-900 text-lg"
        />
        <BodySmall
          text={subtitle}
          type={TextFontType.Regular}
          customClassName="text-gray-400 mt-2 text-center"
        />
        {onRefresh && (
          <CustomButton
            title="Refresh"
            onPress={onRefresh}
            outline
            containerClassName="mt-10 min-w-[160px]"
          />
        )}
      </View>
    </View>
  );
};

export default NoDataComponent;

export const NoUserDataComponent = () => {
  return (
    <NoDataComponent title="No User Data" subtitle="Please log in again." />
  );
};
