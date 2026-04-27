import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import FilterTeacherModal from "@/src/components/UI/Modals/FilterTeacherModal";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";
import { GetStaffAttendance } from "@/src/services/attendance";
import moment from "moment";

const AttendanceHistoryDetailForInstructorScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const filterModalRef = useRef<ModalProp>(null);

  const [date, setDate] = useState<string | null>(null);
  const [attendancePeriod, setAttendancePeriod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attendanceHistoryDetail, setAttendanceHistoryDetail] = useState<any[]>([]);

  useEffect(() => {
    if (route?.params) {
      const isoDate = route.params.date || moment().format("YYYY-MM-DD");
      setDate(isoDate);
      setAttendancePeriod(route.params.attendancePeriod || "Morning");
      fetchAttendance(isoDate, route.params.attendancePeriod || "Morning");
    }
  }, [route?.params]);

  const fetchAttendance = async (isoDate: string, period: string) => {
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetStaffAttendance({ date: isoDate });
      if (responseStatus === 200) {
        const rows = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        const filtered = rows
          .filter((item: any) => period === "Morning" ? item.sessionType === "MORNING" : item.sessionType === "AFTERNOON")
          .map((item: any) => ({
            accountId: item.staff?.id || item.staffId,
            firstName: item.staff?.firstName || "",
            lastName: item.staff?.lastName || "",
            role: item.staff?.designation || item.staff?.role || "Staff",
            status: item.status,
            time: item?.date ? moment(item.date).format("hh:mm A") : "--:--",
          }));
        setAttendanceHistoryDetail(filtered);
      }
    } catch (error) {
      console.error("fetchAttendance error:", error);
      setAttendanceHistoryDetail([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 px-4 py-7 bg-white">
        <LoadingComponent />
      </View>
    );
  }

  const presentsCount = attendanceHistoryDetail.filter(i => i.status === "PRESENT").length;
  const absentsCount = attendanceHistoryDetail.filter(i => i.status === "ABSENT").length;
  const avgPercentage = attendanceHistoryDetail.length
    ? ((presentsCount / attendanceHistoryDetail.length) * 100).toFixed(0)
    : "0";

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />
      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18
          text={date ? moment(date).format("dddd, Do MMMM, YYYY") : "Date"}
          customClassName="ml-5 text-gray-900"
        />
      </View>

      <AttendanceHistoryButton
        title={`${attendancePeriod === 'Morning' ? 'Morning' : 'Afternoon'} attendance`}
        leftText={`${isNaN(Number(avgPercentage)) ? 0 : avgPercentage}% Avg.`}
        customClassName="mt-5 bg-orange-500"
        titleClassName="text-white"
        leftTextClassName="text-white"
      />

      <View className="flex-row justify-between items-center mt-3">
        <AttendanceCard
          title="Presents"
          subtitle={`${presentsCount} Teachers`}
          borderColor="border-green-500 bg-green-50"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${absentsCount} Teachers`}
          borderColor="border-red-500 bg-red-50"
        />
      </View>

      <InputWithFilter
        placeHolder={`Search for teacher`}
        filterModalRef={filterModalRef}
      />

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-900">Teachers</Text>
        <Text className="text-base font-bold text-gray-900">{attendanceHistoryDetail.length}</Text>
      </View>

      <FlatList
        data={attendanceHistoryDetail}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("InstructorAttendanceViewScreen", { id: item.accountId })}
            className="flex-row items-center justify-between mb-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <CustomAvatar name={`${item.firstName} ${item.lastName}`} size={45} />
              <View className="ml-3 flex-1">
                <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{item.firstName} {item.lastName}</Text>
                <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
                  {item.role} • {item.time}
                </Text>
              </View>
            </View>

            <View className={`w-8 h-8 rounded-full items-center justify-center ${item.status === 'PRESENT' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`font-bold ${item.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status === 'PRESENT' ? 'P' : 'A'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.accountId.toString()}
        ListFooterComponent={() => <View className="h-20" />}
      />

      <FilterTeacherModal ref={filterModalRef} />
    </View>
  );
};

export default AttendanceHistoryDetailForInstructorScreen;
