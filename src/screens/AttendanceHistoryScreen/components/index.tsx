import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { EAttendanceHistoryCardStatus } from "@/src/contracts";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export const AttendanceHistoryCard = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("AttendanceHistoryDetailScreen")}
      className="bg-info-500 flex-row items-center p-3 mb-3 rounded-md"
    >
      <View>
        <View className="bg-white p-2 rounded-full">
          <Ionicons name="trophy" size={18} color={COLORS.primary[400]} />
        </View>
      </View>
      <View className="flex-row items-center justify-between flex-1 ml-2">
        <View>
          <Text className="text-white font-normal mb-2">
            Monday, 16th March, 2024
          </Text>
          <Text className="text-white text-[12px]">Morning Attendance</Text>
        </View>
        <View>
          <Text className="text-white text-[13px]">90% Avg</Text>
          <View className="flex-row items-center justify-between mt-2">
            <AttendanceHistoryCardStatus />
            <AttendanceHistoryCardStatus
              status={EAttendanceHistoryCardStatus.ABSENT}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AttendanceHistoryCardStatus = ({
  status = EAttendanceHistoryCardStatus.PRESENT,
}: {
  status?: EAttendanceHistoryCardStatus;
}) => {
  const isPresent = status === EAttendanceHistoryCardStatus.PRESENT;

  return (
    <View className="flex-row items-center mr-1">
      <Text
        className={`text-[9px] py-[3px] px-[6px] text-white rounded-full ${
          isPresent ? "bg-success-700" : "bg-danger-500"
        }`}
      >
        {isPresent ? "P" : "A"}
      </Text>
      <Text className="text-[9px] text-white ml-[3px]">120</Text>
    </View>
  );
};
