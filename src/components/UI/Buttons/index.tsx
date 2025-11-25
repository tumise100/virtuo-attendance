import { COLORS } from "@/src/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export const CustomButton = ({
  title,
  disabled,
  outline,
  onPress,
  loading,
  loadingWithText,
  customClassName,
  containerClassName,
  loadingColor,
}: {
  title: string;
  outline?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
  loadingWithText?: boolean;
  loadingColor?: string;
  customClassName?: string;
  containerClassName?: string;
}) => {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      className={`${containerClassName}`}
    >
      <LinearGradient
        colors={
          disabled
            ? [COLORS.gray3, COLORS.gray3]
            : outline
            ? [COLORS.transparent, COLORS.transparent]
            : [COLORS.primary[500], COLORS.primary[450]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className={`flex-row justify-center px-7 py-4 items-center mb-4 rounded-md border border-transparent ${
          outline && "border-primary-500"
        } ${customClassName}`}
      >
        {loading ? (
          <ActivityIndicator color={loadingColor || COLORS.white} />
        ) : (
          <Text
            className={`text-white font-medium ${
              outline && "text-primary-500"
            }`}
          >
            {title}
          </Text>
        )}
        {loadingWithText ? <ActivityIndicator color={COLORS.white} /> : null}
      </LinearGradient>
    </TouchableOpacity>
  );
};
