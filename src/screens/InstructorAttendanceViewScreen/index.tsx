import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { CustomButton } from "@/src/components/UI/Buttons";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import CalendarFilterModal from "@/src/components/UI/Modals/CalendarFilterModal";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { GetASingleTeacherAttendance } from "@/src/services/attendance";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

const InstructorAttendanceViewScreen = ({
  route,
  navigation,
}: StackNavigationProps) => {
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef<ModalProp>(null);

  const teacherParam = route?.params?.teacher as any;
  const teacherId = (route?.params?.id as number) || teacherParam?.id || 1;
  const initialName = teacherParam
    ? `${teacherParam.firstName || ""} ${teacherParam.lastName || ""}`.trim()
    : "";
  const [teacherName, setTeacherName] = useState(initialName || "Staff");
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);

  const fetchStaffAttendance = async (id: number | string) => {
    if (!id) return;
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetASingleTeacherAttendance(id);
      if (responseStatus === 200) {
        const records = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        
        if (records[0]?.staff) {
          const resolved = `${records[0].staff.firstName || ""} ${records[0].staff.lastName || ""}`.trim();
          if (resolved) setTeacherName(resolved);
        }

        if (records.length === 0) {
          setAttendanceHistory([]);
          return;
        }

        // Group by date
        const groupedMap = new Map<string, any>();
        
        records.forEach((item: any) => {
          const dateKey = moment(item.date).format("YYYY-MM-DD");
          if (!groupedMap.has(dateKey)) {
            groupedMap.set(dateKey, {
              date: item.date,
              clockIn: "--:--",
              clockOut: "--:--",
              present: false,
            });
          }
          const entry = groupedMap.get(dateKey);
          if (item.status === "PRESENT") {
            entry.present = true;
            const timeStr = moment(item.date).format("hh:mm A");
            if (item.sessionType === "MORNING") {
              entry.clockIn = timeStr;
            } else if (item.sessionType === "AFTERNOON") {
              entry.clockOut = timeStr;
            }
          }
        });

        const sorted = Array.from(groupedMap.values()).sort((a, b) => 
          moment(b.date).diff(moment(a.date))
        ).map((item, index) => ({
          ...item,
          id: index.toString(),
          status: item.present ? "Present" : "Absent",
        }));

        setAttendanceHistory(sorted);
      }
    } catch (error) {
      console.error("fetchStaffAttendance error:", error);
      setAttendanceHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAttendance(teacherId);
  }, [teacherId]);

  // Force refresh on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStaffAttendance(teacherId);
    });
    return unsubscribe;
  }, [navigation, teacherId]);

  if (loading) {
    return (
      <View className="flex-1 bg-white px-4 pt-14">
        <LoadingComponent />
      </View>
    );
  }

  const presents = attendanceHistory.filter((item) => item.status === "Present").length;
  const absents = attendanceHistory.length - presents;

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1">
          <BackBtn />
          <SubheadingSemibold18 text={teacherName} customClassName="ml-4 text-gray-900 flex-1" />
        </View>
        {/* Calendar Icon */}
        <TouchableOpacity
          className="w-10 h-10 border border-gray-200 rounded-lg items-center justify-center bg-white"
          onPress={() => calendarRef.current?.setVisible(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.gray3} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between items-center mb-6">
        <AttendanceCard
          title="Presents"
          subtitle={`${presents}`}
          borderColor="border-green-500 bg-green-50"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${absents}`}
          borderColor="border-red-500 bg-red-50"
        />
      </View>

      {/* Attendance List */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-base font-bold text-gray-900">Attendance History</Text>
        </View>

        <FlatList
          data={attendanceHistory}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchStaffAttendance(teacherId)} tintColor="#F97316" colors={["#F97316"]} />}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between mb-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center mr-3">
                  <Ionicons name="trophy" size={18} color="#F97316" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-900">{moment(item.date).format("dddd, Do MMM")}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{item.clockIn} - {item.clockOut}</Text>
                </View>
              </View>

              <View className={`w-7 h-7 rounded-lg items-center justify-center ${item.status === 'Present' ? 'bg-green-50' : 'bg-red-50'}`}>
                <Text className={`text-xs font-bold ${item.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.status === 'Present' ? 'P' : 'A'}
                </Text>
              </View>
            </View>
          )}
          ListFooterComponent={<View className="h-10" />}
        />
      </View>

      {/* Calendar Modal */}
      <CalendarFilterModal ref={calendarRef} />

    </View>
  );
};

export default InstructorAttendanceViewScreen;
