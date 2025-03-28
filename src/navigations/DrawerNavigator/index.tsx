import VlogoImg from "@/assets/images/Vlogo1.png";
import { showToast } from "@/src/components/UI/showToast";
import HomeScreen from "@/src/screens/HomeScreen";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyRegular } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import * as Updates from "expo-updates";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
  const { updateUserToken } = combineStore();

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        showToast("New update available!");
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        showToast("No new update available.");
      }
    } catch (error) {
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  return (
    <View className="p-3 flex-1">
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
          Icon={AntDesign}
          label="Profile"
          onPress={() => props.navigation.navigate("ProfileScreen")}
        />
        <CustomDrawerContentItem
          iconName="send-o"
          Icon={FontAwesome}
          label="Sessions"
        />
        <CustomDrawerContentItem
          iconName="send-o"
          Icon={FontAwesome}
          label="Change Password"
          onPress={() => props.navigation.navigate("ChangePasswordScreen")}
        />
        <CustomDrawerContentItem
          iconName="call-outline"
          Icon={Ionicons}
          label="Support"
          onPress={() => props.navigation.navigate("SupportScreen")}
        />
        <CustomDrawerContentItem
          iconName="people"
          Icon={Octicons}
          label="About Us"
          onPress={() => props.navigation.navigate("AboutUsScreen")}
        />
        <CustomDrawerContentItem
          iconName="people"
          Icon={Octicons}
          label="Write Student Info into tag"
          showMoreIcon={false}
          onPress={() => props.navigation.navigate("WriteStudentInfoTagScreen")}
        />
        <CustomDrawerContentItem
          iconName="update"
          Icon={MaterialIcons}
          label="Check for new updates"
          showMoreIcon={false}
          onPress={onFetchUpdateAsync}
        />
      </View>
      <View className="justify-center items-center mt-[75%]l mt-auto">
        <TouchableOpacity
          className="flex-row items-center p-3 bg-danger-600 rounded-md"
          onPress={() => {
            updateUserToken("");
            // props.navigation.navigate("AuthNavigator", {
            //   screen: "SignInScreen",
            // })
          }}
        >
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
  onPress,
}: {
  iconName: string;
  Icon: any;
  label: string;
  showMoreIcon?: boolean;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mb-7"
    >
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
