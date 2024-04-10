import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

// "name": "virtuo-mobile-app",

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  return (
    <ScrollView className="flex-1 bg-white">
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text>HomeScreen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
