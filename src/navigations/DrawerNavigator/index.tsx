import VlogoImg from "@/assets/images/Vlogo1.png";
import { showToast } from "@/src/components/UI/showToast";
import HomeScreen from "@/src/screens/HomeScreen";
import { combineStore } from "@/src/store";
import { GetBranches } from "@/src/services/school";
import { GenericDropdown } from "@/src/components/UI/Dropdown";
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
  Feather,
} from "@expo/vector-icons";
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import * as Updates from "expo-updates";
import React from "react";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { asArray } from "@/src/utils";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { updateUserToken, user, activeBranchId, updateActiveBranch } = combineStore();
  const [branches, setBranches] = React.useState<any[]>([]);
  const [loadingBranches, setLoadingBranches] = React.useState(false);

  React.useEffect(() => {
    const account = (user?.accounts as any[])?.[0] as any;
    const isSchool = account?.type === "SCHOOL" || account?.type === "ADMIN";
    const staff = account?.staff;
    const isSuperAdmin = account?.type === "SCHOOL" || staff?.isSuperAdmin;

    if (isSchool || isSuperAdmin) {
      setLoadingBranches(true);
      GetBranches()
        .then(({ responseData, responseStatus }) => {
          if (responseStatus === 200) {
            setBranches(asArray(responseData));
          }
        })
        .finally(() => setLoadingBranches(false));
    }
  }, [user]);


  const account = (user?.accounts as any[])?.[0] as any;
  const staff = account?.staff;
  const school = account?.school;
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    [staff?.firstName, staff?.lastName].filter(Boolean).join(" ") ||
    school?.ownerName ||
    school?.name ||
    "User";
  const displaySubtitle =
    account?.type === "SCHOOL"
      ? school?.name || "School Admin"
      : staff?.designation || "Staff";
  const profileImage = (user as any)?.image || staff?.image || school?.logo || null;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase())
    .join("") || "U";

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
    <View className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center mt-12 mb-4">
        <View className="relative">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              className="h-20 w-20 rounded-full border-2 border-primary-500"
              resizeMode="cover"
            />
          ) : (
            <View className="h-20 w-20 rounded-full border-2 border-primary-500 bg-primary-100 items-center justify-center">
              <Text className="text-primary-500 text-2xl font-bold">{initials}</Text>
            </View>
          )}
        </View>
        <Text className="text-lg font-semibold mt-2 text-black">{displayName}</Text>
        <Text className="text-gray-500 text-xs">{displaySubtitle}</Text>
        <TouchableOpacity
          className="mt-2 border border-gray-300 rounded-lg px-4 py-1"
          onPress={() => props.navigation.navigate("ProfileScreen")}
        >
          <Text className="text-xs text-gray-500">Edit</Text>
        </TouchableOpacity>

        {/* Branch Switcher */}
        {(() => {
          const account = (user?.accounts as any[])?.[0] as any;
          const staff = account?.staff;
          const isSuperAdmin = account?.type === "SCHOOL" || staff?.isSuperAdmin;
          const branchAccess = staff?.branchAccess || [];
          
          const filteredBranches = branches.filter(b => 
            isSuperAdmin || branchAccess.some((ba: any) => ba.id === b.id)
          );

          if (filteredBranches.length === 0 && !loadingBranches) return null;

          return (
            <View className="w-full px-4 mt-4">
              <Text className="text-[10px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Branch Access</Text>
              <GenericDropdown
                data={filteredBranches.map(b => ({ label: b.name, value: b.id }))}
                labelField="label"
                valueField="value"
                placeholder={loadingBranches ? "Loading branches..." : "Select Branch"}
                value={activeBranchId}
                onChange={item => {
                  if (isSuperAdmin || branchAccess.length > 1) {
                    updateActiveBranch(item.value);
                    showToast(`Switched to ${item.label}`);
                    // Optionally refresh app state or close drawer
                  } else {
                    showToast("You don't have permission to switch branches");
                  }
                }}
                disable={!isSuperAdmin && branchAccess.length <= 1}
              />
            </View>
          );
        })()}
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 px-4 mt-2">
        <CustomDrawerContentItem
          iconName="message-square"
          Icon={Feather}
          label="Message"
          onPress={() => props.navigation.navigate("MessagesScreen")}
        />
        <CustomDrawerContentItem
          iconName="calendar"
          Icon={Feather}
          label="Timetable/Break"
          onPress={() => props.navigation.navigate("TimetableScreen")}
        />
        <CustomDrawerContentItem
          iconName="book-open"
          Icon={Feather}
          label="Subject Lesson"
          onPress={() => props.navigation.navigate("SubjectLessonsScreen")}
        />
        <CustomDrawerContentItem
          iconName="help-circle"
          Icon={Feather}
          label="Question Banks"
          onPress={() => props.navigation.navigate("QuestionBankScreen")}
        />
        <CustomDrawerContentItem
          iconName="calendar"
          Icon={Feather}
          label="Leave Application"
          onPress={() => props.navigation.navigate("LeaveScreen")}
        />

        <CustomDrawerContentItem
          iconName="settings" // Settings (Feather sliders)? 'settings' is standard feather.
          Icon={Feather}
          label="Settings"
          onPress={() => props.navigation.navigate("SettingsScreen")}
        />

        {/* Existing / Kept Items */}
        <CustomDrawerContentItem
          iconName="tag" // Octicons 'people' was used before? maybe stick to feather where possible or mix? 'tag' exists in feather.
          Icon={Feather}
          label="Write Student Info into tag"
          showMoreIcon={false}
          onPress={() => props.navigation.navigate("WriteStudentInfoTagScreen")}
        />
        <CustomDrawerContentItem
          iconName="refresh-cw" // MaterialIcons 'update'? feather 'refresh-cw'
          Icon={Feather}
          label="Check for new updates"
          showMoreIcon={false}
          onPress={onFetchUpdateAsync}
        />
      </ScrollView>

      {/* Logout Footer */}
      <View className="mb-8 px-4">
        <TouchableOpacity
          className="flex-row items-center justify-center p-3 bg-red-600 rounded-xl"
          onPress={() => {
            updateUserToken("");
          }}
        >
          <Feather name="log-out" size={20} color="white" />
          <Text className="text-white font-medium ml-2">Logout</Text>
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
