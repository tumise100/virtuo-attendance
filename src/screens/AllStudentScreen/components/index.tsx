import { COLORS } from "@/src/theme/colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text, TouchableOpacity, View } from "react-native";

export const AttendanceHistoryButton = ({
  title,
  leftText,
  customClassName,
  titleClassName,
  leftTextClassName,
}: {
  title: string;
  leftText?: string;
  customClassName?: string;
  titleClassName?: string;
  leftTextClassName?: string;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("AttendanceHistoryScreen")}
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
