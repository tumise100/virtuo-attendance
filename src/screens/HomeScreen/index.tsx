import CustomAvatar from "@/src/components/UI/CustomAvatar";
import CustomPaperTextInputWithIcons from "@/src/components/UI/Inputs/CustomPaperTextInputWithIcons";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { showToast } from "@/src/components/UI/showToast";
import { IClassHeader } from "@/src/contracts/course";
import { IStudent } from "@/src/contracts/user";
import { GetAllStudents, GetMe } from "@/src/services/auth";
import { GetLecturerClasses } from "@/src/services/courses";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { InputLabelMedium12, TextMedium14 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import QuickAction from "./components/QuickAction";
import RecentClasses from "./components/RecentClasses";
import moment from "moment";

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  const [recentClass, setRecentClass] = useState<IClassHeader[] | null>(null);
  const [allStudents, setAllStudents] = useState<IStudent[] | null>(null);

  const [loadingUser, setLoadingUser] = useState(false);

  const [loadingRecentClass, setLoadingRecentClass] = useState(false);
  const [loadingAllStudent, setLoadingAllStudent] = useState(false);

  const { user, updateUser } = combineStore();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    setLoadingUser(true);
    GetMe()
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "fetchUser");
        if (responseStatus !== 200) {
          console.log(responseData, "responseData");
          showToast(responseData.message);
        } else if (responseData.accounts) {
          // getLecturerRecentClasses(responseData.accounts[0].id);
          updateUser(responseData);
        }
      })
      .catch((err) => {
        // showToast("Wrong Credentials!");
        console.log(err, "err");
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  const fetchAllStudents = async () => {
    setLoadingAllStudent(true);
    await GetAllStudents()
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "some student ");
        if (responseStatus === 200) {
          setAllStudents(responseData.data);
        } else {
          showToast("Some went wrong!");
          console.log(responseData, "some data 2");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => setLoadingAllStudent(false));
  };

  const getLecturerRecentClasses = (lecturerId: number) => {
    setLoadingRecentClass(true);
    console.log(lecturerId, "lecturerId");

    GetLecturerClasses({ lecturerId })
      .then(({ responseData, responseStatus }) => {
        console.log(responseData, responseStatus, "getLecturerRecentClasses");
        if (responseStatus !== 200) {
          console.log(responseData, "responseData");
          showToast(responseData.message);
        } else if (responseData.data) {
          setRecentClass(responseData.data);
        }
      })
      .catch((err) => {
        // showToast("Wrong Credentials!");
        console.log(err, "err");
      })
      .finally(() => {
        setLoadingRecentClass(false);
      });
  };

  if (loadingUser) {
    return (
      <View className="flex-1 bg-white p-3">
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-3 pt-2">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={27} />
        </TouchableOpacity>
        <View className="items-center">
          <TextMedium14
            text={`${moment().format("YYYY")}/${moment()
              .add("1", "year")
              .format("YYYY")} Session`}
          />
          {/* <TextMedium14 text="2022/2023 Session" /> */}
          {/* <InputLabelMedium12 text="semester 1" customClassName="font-normal" /> */}
        </View>
        <CustomAvatar
          size={48}
          name={`${user?.firstName} ${user?.lastName}`}
          onPress={() => navigation.navigate("ProfileScreen")}
        />
      </View>
      <View className="mt-4">
        <CustomPaperTextInputWithIcons
          outerStyle="bg-white border border-borderColor"
          innerStyle="bg-white text-sm"
          rightComponent={
            <TextInput.Icon
              icon={() => (
                <Ionicons
                  name="search-outline"
                  color={COLORS.black}
                  size={22}
                />
              )}
            />
          }
          placeholder="Search for student"
        />
      </View>
      <RecentClasses
        loadingRecentClass={loadingRecentClass}
        recentClass={recentClass}
      />
      <QuickAction />
      {/* <TopStudents
        allStudents={allStudents}
        loadingAllStudent={loadingAllStudent}
      /> */}
    </ScrollView>
  );
};

export default HomeScreen;
