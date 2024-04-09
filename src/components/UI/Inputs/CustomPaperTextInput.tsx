import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  ImageSourcePropType,
  StatusBar,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";

import { TextInput } from "react-native-paper";
import { COLORS } from "@/src/theme/colors";

const CustomPaperTextInput = ({
  label,
  error,
  onChangeText,
  value,
  onBlur,
  keyboardType,
  isDarkMode,
}: {
  label: string;
  error?: boolean;
  value?: string;
  onChangeText?: (((text: string) => void) & Function) | undefined;
  isDarkMode?: boolean;
  onBlur?:
    | (((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) &
        ((args: any) => void))
    | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      className={`bg-white border text-sm border-gray-400 rounded-md mb-4`}
      label={label}
      keyboardType={keyboardType || "default"}
      underlineColor="transparent"
      activeUnderlineColor={"#000"}
      secureTextEntry={
        (label === "Password" && !showPassword) ||
        (label === "Confirm Password" && !showPassword)
      }
      textColor={isDarkMode ? COLORS.white : COLORS.textColor}
      value={value}
      error={error}
      onChangeText={onChangeText}
      right={
        (label === "Password" || label === "Confirm Password") && (
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((show) => !show)}
          />
        )
      }
    />
  );
};

export default CustomPaperTextInput;
