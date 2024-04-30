import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import HomeScreen from "@/src/screens/HomeScreen";
import VlogoImg from "@/assets/images/Vlogo1.png";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import {
  Feather,
  Entypo,
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  // console.log(Object.keys(props.descriptors));
  return (
    <View className="p-3">
      <View className="flex-row items-center mt-4">
        <Image
          source={VlogoImg}
          className="h-[23px] w-[21px] mr-2"
          resizeMode="contain"
        />
        <SubheadingSemibold18 text="Virtuo Attendance" />
      </View>
      <View className="mt-10">
        <CustomDrawerContentItem
          iconName="user"
          Icon={Feather}
          label="Profile"
        />
        <CustomDrawerContentItem
          iconName="send"
          Icon={Feather}
          label="Sessions"
        />
        <CustomDrawerContentItem
          iconName="send"
          Icon={Feather}
          label="Change Password"
        />
        <CustomDrawerContentItem
          iconName="call-outline"
          Icon={Ionicons}
          label="Support"
        />
        <CustomDrawerContentItem
          iconName="people"
          Icon={Octicons}
          label="About Us"
        />
        <CustomDrawerContentItem
          iconName="terminal-outline"
          Icon={Ionicons}
          label="Terms & conditions"
          showMoreIcon={false}
        />
        <CustomDrawerContentItem
          iconName="shield-account-outline"
          Icon={MaterialCommunityIcons}
          label="Privacy policy"
          showMoreIcon={false}
        />
      </View>
      <View className="justify-center items-center mt-[75%]">
        <TouchableOpacity className="flex-row items-center p-3 bg-danger-600 rounded-md">
          <AntDesign name="logout" size={15} color={COLORS.white} />
          <BodyRegular
            text="Logout"
            type={TextFontType.Regular}
            customClassName="text-white ml-3"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomDrawerContentItem = ({
  iconName,
  Icon,
  label,
  showMoreIcon = true,
}: {
  iconName: string;
  Icon: any;
  label: string;
  showMoreIcon?: boolean;
}) => {
  return (
    <TouchableOpacity className="flex-row items-center justify-between mb-7">
      <View className="flex-row items-center">
        <Icon name={iconName} size={18} color={COLORS.primary[500]} />
        <BodyRegular
          text={label}
          type={TextFontType.Regular}
          customClassName="ml-4"
        />
      </View>
      {showMoreIcon ? (
        <Entypo
          name="chevron-small-right"
          size={27}
          color={COLORS.primary[500]}
        />
      ) : null}
    </TouchableOpacity>
  );
};
