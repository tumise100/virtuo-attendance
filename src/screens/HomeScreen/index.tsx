import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text>HomeScreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
