import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomAvatar = ({
  size = 28,
  textSize = 10,
  name,
  onPress,
  abbrvLength = 3,
}: {
  size?: number;
  textSize?: number;
  name: string;
  onPress?: () => void;
  abbrvLength?: number;
}) => {
  const getName = (name: string) => {
    if (name.trim().split(" ").length > 1) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("");
    } else {
      return name.slice(0, 2);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ height: size, width: size }}
      className="bg-primary-450 rounded-full p-1 justify-center items-center"
    >
      <Text className="text-white" style={{ fontSize: size * 0.35 }}>
        {name ? getName(name).toUpperCase().slice(0, abbrvLength) : "A"}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomAvatar;
