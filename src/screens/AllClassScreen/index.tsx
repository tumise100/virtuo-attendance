import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { ISecondaryClass, ISecondaryClassHeader } from "@/src/contracts/course";
import { AccountType } from "@/src/contracts/user.d";
import { GetClassesOfSecondarySchool } from "@/src/services/class";
import { StackNavigationProps, StackNavigatorProp } from "@/src/shared";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Entypo, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AllClassScreen = ({ navigation }: StackNavigationProps) => {
  const [schoolClasses, setSchoolClasses] = useState<
    ISecondaryClassHeader[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = combineStore();

  useEffect(() => {
    const isSecondaryInstructor =
      user?.accounts[0].lecturer?.lecturerType === "SECONDARY";
    const isSchool = user?.accounts[0].type === AccountType.SCHOOL;

    if (isSecondaryInstructor && user.accounts[0].lecturer) {
      handleFetchClassesOfSecondarySchool({
        schoolId: user.accounts[0].lecturer.schoolId,
      });
    } else if (isSchool && user.accounts[0].school) {
      handleFetchClassesOfSecondarySchool({
        schoolId: user.accounts[0].school.accountId,
      });
    }
  }, [user]);

  const handleFetchClassesOfSecondarySchool = ({
    schoolId,
  }: {
    schoolId: number;
  }) => {
    setIsLoading(true);
    GetClassesOfSecondarySchool({ schoolId })
      .then(({ responseData, responseStatus }) => {
        console.log(JSON.stringify(responseData), "classes of school");
        if (responseData.data) {
          const secondaryClasses = responseData.data;
          setSchoolClasses(secondaryClasses);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center ">
        <BackBtn />
        <SubheadingSemibold18 text="Classes" customClassName="ml-5" />
      </View>

      {isLoading ? (
        <View className="p-3 pt-7">
          <LoadingComponent />
          <LoadingComponent />
        </View>
      ) : schoolClasses && schoolClasses.length ? (
        <ScrollView className="mt-8">
          {schoolClasses.map((classItem) => (
            <ClassItem
              classItem={classItem}
              key={classItem.id}
              onPress={() =>
                navigation.navigate("SecondaryClassDetailScreen", {
                  classItem,
                })
              }
            />
          ))}
        </ScrollView>
      ) : (
        <View className="p-3 pt-7">
          <Text>No Classes Found!</Text>
        </View>
      )}
    </View>
  );
};

export default AllClassScreen;

const ClassItem = ({
  classItem,
  onPress,
}: {
  classItem: ISecondaryClassHeader;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-info-200 p-3 rounded-md flex-row items-center justify-between mb-3 $`}
    >
      <View className="flex-row items-center">
        <View className="bg-white p-2 rounded-full">
          <Ionicons name="trophy" size={18} color={COLORS.primary[400]} />
        </View>
        <View className="ml-3">
          <Text className={`font-medium`}>{classItem.name}</Text>
          <Text className={`text-xs mt-1`}>
            {classItem.name.startsWith("S.S") ? "Senior" : "Junior"}
          </Text>
        </View>
      </View>

      {<Entypo name="chevron-thin-right" size={20} />}
    </TouchableOpacity>
  );
};
