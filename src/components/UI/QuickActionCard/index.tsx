import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import { Overline2Text } from "@/src/theme/typography/OtherText";

const QuickActionCard = ({
  colorType,
  title,
  subtitle,
  onPress,
  iconName,
  Icon,
}: {
  colorType: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  iconName?: string;
  Icon?: any;
}) => {
  let color100 = "";
  let color200 = "";
  let color300 = "";

  switch (colorType) {
    case "success":
      color100 = "bg-success-100";
      color200 = "bg-success-200";
      color300 = "bg-success-300";
      break;
    case "warning":
      color100 = "bg-warning-100";
      color200 = "bg-warning-200";
      color300 = "bg-warning-300";
      break;
    case "info":
      color100 = "bg-info-100";
      color200 = "bg-info-200";
      color300 = "bg-info-300";
      break;
    case "danger":
      color100 = "bg-danger-100";
      color200 = "bg-danger-200";
      color300 = "bg-danger-300";
      break;
    default:
      break;
  }


  // Render as a plain View when no onPress is wired so we don't invite
  // dead taps. Callers that want a tappable action pass onPress.
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      className={`w-[47%] p-3 ${color100} rounded-md`}
    >
      <View className="flex-row">
        <View className={`${color200} p-[5px] rounded-full`}>
          <View className={`${color300} p-[5px] rounded-full`}>
            {Icon ? (
              <Icon name={iconName} size={20} color={COLORS.white} />
            ) : (
              <AntDesign name="appstore" size={20} color={COLORS.white} />
            )}
          </View>
        </View>
      </View>
      <BodyRegular
        text={title}
        type={TextFontType.Medium}
        customClassName="p-0 m-0 pt-2"
      />
      <Overline2Text
        text={subtitle}
        type={TextFontType.Regular}
        customClassName="py-2 leading-[16px]"
      />
    </Container>
  );
};

export default QuickActionCard;
