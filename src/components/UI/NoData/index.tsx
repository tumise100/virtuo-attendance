import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { showToast } from "../showToast";
import { useNavigation } from "@react-navigation/native";

const NoDataComponent = () => {
  return (
    <View className="flex-1 bg-white items-center justify-center ">
      <Text>No Data</Text>
    </View>
  );
};

export default NoDataComponent;

export const NoUserDataComponent = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    showToast("No User Data!");
    // return navigation.replace("AuthNavigator");
  }, []);

  return (
    <View className="flex-1 bg-white items-center justify-center ">
      <Text>No Data</Text>
    </View>
  );
};
