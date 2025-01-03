import { EAttendanceHistoryCardStatus } from "@/src/contracts";
import { IStudentAttendanceHeader } from "@/src/contracts/attendance";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import { Text, TouchableOpacity, View } from "react-native";

export const AttendanceHistoryCard = ({
  item,
  avgPercentage,
  noPresent,
  noAbsent,
  isMorningType,
  isAfternoonType,
  attended,
  alt,
  showAttendanceStatus,
  onPress,
}: {
  item: IStudentAttendanceHeader;
  avgPercentage?: string;
  noPresent?: string;
  noAbsent?: string;
  isMorningType?: boolean;
  isAfternoonType?: boolean;
  attended?: boolean;
  alt?: boolean;
  showAttendanceStatus?: boolean;

  onPress?: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { user } = combineStore();

  const isSecondaryInstructor =
    user?.accounts[0].lecturer?.lecturerType === "SECONDARY";
  const isSchool = user?.accounts[0].school?.accountId;

  return (
    <TouchableOpacity
      onPress={() => {
        onPress
          ? onPress()
          : navigation.navigate(
              // isSchool
              //   ? "AttendanceHistoryDetailForInstructorScreen"
              "AttendanceHistoryDetailScreen",
              {
                date: item.date,
                attendancePeriod: isMorningType
                  ? "Morning"
                  : isAfternoonType
                  ? "Afternoon"
                  : "None",
              }
            );
      }}
      // className="bg-info-500 flex-row items-center p-3 mb-3 rounded-md"
      className={`${
        alt ? "bg-white" : "bg-info-500"
      } flex-row items-center p-3 mb-3 rounded-md ${
        alt && "border border-gray-300"
      }`}
    >
      <View>
        <View
          className={`${alt ? "bg-info-500" : "bg-white"} p-2 rounded-full`}
        >
          <Ionicons
            name="trophy"
            size={18}
            color={alt ? COLORS.white : COLORS.primary[400]}
          />
        </View>
      </View>
      <View className="flex-row items-center justify-between flex-1 ml-2">
        <View>
          <Text
            className={`${alt ? "text-black" : "text-white"} font-normal mb-2`}
          >
            {moment(item.date).format("dddd, Do MMMM, YYYY")}
            {/* Monday, 16th March, 2024 */}
          </Text>
          <Text className={`${alt ? "text-black" : "text-white"} text-[12px]`}>
            {isMorningType ? "Morning" : isAfternoonType && "Afternoon"}{" "}
            Attendance
          </Text>
        </View>
        <View>
          {avgPercentage && (
            <Text
              className={`${alt ? "text-black" : "text-white"} text-[13px]`}
            >
              90% Avg
            </Text>
          )}
          {showAttendanceStatus && (
            <View className="flex-row items-center justify-between mt-2">
              {attended ? (
                <AttendanceHistoryCardStatus />
              ) : (
                <AttendanceHistoryCardStatus
                  status={EAttendanceHistoryCardStatus.ABSENT}
                />
              )}
            </View>
          )}
          <View className="flex-row items-center justify-between mt-2">
            {noPresent && <AttendanceHistoryCardStatusWithNumbers />}
            {noAbsent && (
              <AttendanceHistoryCardStatusWithNumbers
                status={EAttendanceHistoryCardStatus.ABSENT}
              />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AttendanceHistoryCardStatusWithNumbers = ({
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

export const AttendanceHistoryButton = ({
  title,
  leftText,
  customClassName,
  titleClassName,
  leftTextClassName,
  onPress,
}: {
  title: string;
  leftText?: string;
  customClassName?: string;
  titleClassName?: string;
  leftTextClassName?: string;
  onPress?: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-info-200 p-3 rounded-md flex-row items-center justify-between mb-3 ${customClassName}`}
    >
      <View className="flex-row items-center">
        <View className="bg-white p-2 rounded-full">
          <Ionicons name="trophy" size={18} color={COLORS.primary[400]} />
        </View>
        <Text className={`ml-3 font-medium ${titleClassName}`}>{title}</Text>
      </View>

      {leftText ? (
        <Text className={`${leftTextClassName}`}>{leftText}</Text>
      ) : (
        <Entypo name="chevron-thin-right" size={20} />
      )}
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
    </View>
  );
};
