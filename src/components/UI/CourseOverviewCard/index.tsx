import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  DescriptionText,
  Overline1Text,
} from "@/src/theme/typography/OtherText";
import { TextFontType } from "@/src/theme/typography/typography";
import { COLORS } from "@/src/theme/colors";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CourseOverviewCard = ({
  title,
  code,
  customclassName,
}: {
  title?: string;
  code?: string;
  customclassName?: string;
}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("CourseViewScreen")}
      className={`flex-row rounded-md items-center justify-between bg-info-300 p-3 mb-3 ${customclassName}`}
    >
      <View className="flex-row items-center">
        <View className="bg-white p-[10px] rounded-full">
          <Ionicons name="trophy" size={19} color={COLORS.primary[500]} />
        </View>
        <View className="ml-2">
          <Overline1Text
            text={`Intro. to ${title || "Computer Science"}`}
            type={TextFontType.Bold}
          />
          <DescriptionText
            text={`${code || "CMP101"} Tuesday (9AM - 12PM)`}
            type={TextFontType.Regular}
            customClassName="normal-case"
          />
        </View>
      </View>
      <View className="items-center">
        <Entypo name="chevron-thin-right" size={20} />
      </View>
    </TouchableOpacity>
  );
};

export default CourseOverviewCard;
