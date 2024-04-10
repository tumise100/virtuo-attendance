import { View, Text } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import HomeScreen from "@/src/screens/HomeScreen";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="HomeScreen1" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <View>
      <Text>Hello 1</Text>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Help"
        onPress={() => alert("Link to help")}
        style={{ margin: 0, paddingVertical: 10 , backgroundColor:'red'}}
      />
    </View>
  );
};
