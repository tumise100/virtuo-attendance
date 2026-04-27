import { View, Text, StatusBar, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { Ionicons } from "@expo/vector-icons";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import { GetASingleStudentAttendance } from "@/src/services/attendance";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import CalendarFilterModal from "@/src/components/UI/Modals/CalendarFilterModal";
import { asArray } from "@/src/utils";

type HistoryRow = {
  id: string;
  date: string;
  type: "Morning Attendance" | "Afternoon Attendance";
  status: "PRESENT" | "ABSENT";
  markedAt?: string;
};

const StudentAttendanceHistoryScreen = ({ route, navigation }: StackNavigationProps) => {
  const calendarRef = useRef<ModalProp>(null);
  const studentParam = route?.params?.student as any;
  const studentId = (route?.params?.id as number) || studentParam?.id;

  const initialName = studentParam
    ? [studentParam.firstName, studentParam.lastName].filter(Boolean).join(" ").trim()
    : "";
  const [studentName, setStudentName] = useState(initialName || "Student");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<HistoryRow[]>([]);

  const fetchHistory = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetASingleStudentAttendance(studentId);
      if (responseStatus === 200) {
        const rows = asArray<any>(responseData);
        if (rows[0]?.student) {
          const resolved = [rows[0].student.firstName, rows[0].student.lastName].filter(Boolean).join(" ").trim();
          if (resolved) setStudentName(resolved);
        }
        const mapped: HistoryRow[] = rows.map((r: any, idx: number) => ({
          id: `${r?.id ?? idx}`,
          date: r?.date,
          type: r?.sessionType === "AFTERNOON" ? "Afternoon Attendance" : "Morning Attendance",
          status: r?.status === "PRESENT" ? "PRESENT" : "ABSENT",
          markedAt: r?.date ? moment(r.date).format("h:mm A") : undefined,
        }));
        mapped.sort((a, b) => moment(b.date).diff(moment(a.date)));
        setRecords(mapped);
      }
    } catch (error) {
      console.error("fetchHistory error:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchHistory);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, studentId]);

  if (loading) {
    return (
      <View className="flex-1 bg-white px-4 pt-14">
        <LoadingComponent />
      </View>
    );
  }

  const presents = records.filter((r) => r.status === "PRESENT").length;
  const absents = records.length - presents;

  const klass =
    studentParam?.currentClass?.name || studentParam?.class?.name || "";
  const headerText = klass ? `${studentName} (${klass})` : studentName;

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" animated />

      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center flex-1">
          <BackBtn />
          <SubheadingSemibold18 text={headerText} customClassName="ml-4 text-gray-900 flex-1" />
        </View>
        <TouchableOpacity
          className="w-10 h-10 border border-gray-200 rounded-lg items-center justify-center"
          onPress={() => calendarRef.current?.setVisible(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="gray" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <AttendanceCard title="Presents" subtitle={`${presents}`} borderColor="border-green-500 bg-green-50" />
        <AttendanceCard title="Absents" subtitle={`${absents}`} borderColor="border-red-500 bg-red-50" />
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-gray-900">Attendance</Text>
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHistory} tintColor="#F97316" colors={["#F97316"]} />}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between mb-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-gray-900 items-center justify-center mr-3">
                <Ionicons name="trophy" size={18} color="#F97316" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900">
                  {item.date ? moment(item.date).format("dddd, Do MMM, YYYY") : "—"}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {item.type}{item.status === "PRESENT" && item.markedAt ? ` • ${item.markedAt}` : ""}
                </Text>
              </View>
            </View>
            <View className={`w-7 h-7 rounded-lg items-center justify-center ${item.status === "PRESENT" ? "bg-green-50" : "bg-red-50"}`}>
              <Text className={`text-xs font-bold ${item.status === "PRESENT" ? "text-green-600" : "text-red-600"}`}>
                {item.status === "PRESENT" ? "P" : "A"}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-16">
            <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">No attendance records</Text>
          </View>
        )}
        ListFooterComponent={() => <View className="h-10" />}
      />

      <CalendarFilterModal ref={calendarRef as any} />
    </View>
  );
};

export default StudentAttendanceHistoryScreen;
