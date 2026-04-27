import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import React, { useEffect, useState, useRef } from "react";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProps } from "@/src/shared";
import { combineStore } from "@/src/store";
import CalendarFilterModal from "@/src/components/UI/Modals/CalendarFilterModal";
import PaginationControls from "../../components/UI/PaginationControls";
import { GetStudentAttendance, GetStaffAttendance } from "@/src/services/attendance";
import moment from "moment";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

const AttendanceHistoryScreen = ({ navigation }: StackNavigationProps) => {
  const calendarModalRef = useRef<any>(null);
  const { user } = combineStore();
  const account = user?.accounts?.[0] as any;
  const isSchool = account?.type === "SCHOOL";
  const schoolId = account?.school?.id || account?.school?.accountId;
  const staffId = account?.staff?.id;
  const [loading, setLoading] = useState(false);
  const [attendanceRows, setAttendanceRows] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchAttendanceHistory();
  }, [schoolId, staffId, isSchool, selectedDate, fromDate, toDate]);

  const fetchAttendanceHistory = async () => {
    if (!schoolId && !staffId) return;
    setLoading(true);
    try {
      const query: any = {};
      if (isSchool) {
        if (schoolId) query.schoolId = schoolId;
      } else {
        if (staffId) query.staffId = staffId;
      }
      if (selectedDate) {
        query.date = selectedDate;
      } else if (fromDate || toDate) {
        if (fromDate) query.fromDate = fromDate;
        if (toDate) query.toDate = toDate;
      } else {
        query.period = "week";
      }

      const request = isSchool ? GetStudentAttendance(query) : GetStaffAttendance(query);
      const { responseData, responseStatus } = await request;
      if (responseStatus === 200) {
        const records = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];

        const grouped = new Map<string, { id: string; date: string; type: string; p: number; a: number }>();

        records.forEach((item: any) => {
          const rawDate = item?.date ? String(item.date) : "";
          if (!rawDate) return;
          const dateKey = moment(rawDate).format("YYYY-MM-DD");
          const type = item?.sessionType === "AFTERNOON" ? "Afternoon" : "Morning";
          const key = `${dateKey}-${type}`;

          if (!grouped.has(key)) {
            grouped.set(key, {
              id: key,
              date: dateKey,
              type,
              p: 0,
              a: 0,
            });
          }

          const row = grouped.get(key)!;
          if (item.status === "PRESENT") row.p += 1;
          else row.a += 1;
        });

        setAttendanceRows(Array.from(grouped.values()).sort((a, b) => (a.date < b.date ? 1 : -1)));
      }
    } catch (error) {
      console.error("fetchAttendanceHistory error:", error);
      setAttendanceRows([]);
    } finally {
      setLoading(false);
    }
  };

  const paginatedHistory = attendanceRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPresent = attendanceRows.reduce((sum, item) => sum + item.p, 0);
  const totalAbsent = attendanceRows.reduce((sum, item) => sum + item.a, 0);
  const totalParticipants = totalPresent + totalAbsent;
  const avgAttendance = totalParticipants ? Math.round((totalPresent / totalParticipants) * 100) : 0;

  return (
    <ScreenContainer>
      <View className="flex-row items-center justify-between px-4 mb-6">
        <View className="flex-row items-center ">
          <BackBtn />
          <SubheadingSemibold18
            text="Attendance history"
            customClassName="ml-5 text-gray-900"
          />
        </View>
        <TouchableOpacity
          className="border border-gray-200 p-2 rounded-lg"
          onPress={() => calendarModalRef.current?.setVisible(true)}
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.gray3} />
        </TouchableOpacity>
      </View>


      <View className="flex-1 px-4">
        {(selectedDate || fromDate || toDate) && (
          <View className="flex-row items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-4">
            <Text className="text-xs text-orange-700 flex-1" numberOfLines={1}>
              {selectedDate
                ? moment(selectedDate).format("MMM D, YYYY")
                : `${fromDate ? moment(fromDate).format("MMM D, YYYY") : "…"} - ${toDate ? moment(toDate).format("MMM D, YYYY") : "…"}`}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(null);
                setFromDate(null);
                setToDate(null);
              }}
            >
              <Ionicons name="close-circle" size={18} color="#EA580C" />
            </TouchableOpacity>
          </View>
        )}

        {/* Summary Cards */}
        <View className="flex-row justify-between mb-8">
          <View className="w-[48%] relative bg-white border border-gray-200 border-l-orange-500 border-l-4 rounded-xl p-4 shadow-sm">
            <View className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500 rounded-l-xl" />
            <Text className="text-gray-500 text-sm mb-1 ml-1">Total Records</Text>
            <Text className="text-2xl font-bold text-black ml-1">{attendanceRows.length}</Text>
          </View>

          <View className="w-[48%] relative bg-white border border-blue-200 rounded-xl p-4 shadow-sm overflow-hidden">
            <View className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500" />
            <Text className="text-gray-500 text-sm mb-1 ml-2">Average attendance</Text>
            <Text className="text-2xl font-bold text-black ml-2">{avgAttendance}%</Text>
          </View>
        </View>

        {/* Attendance List Header */}
        <Text className="text-base font-bold text-gray-900 mb-4">Attendance</Text>

        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAttendanceHistory} tintColor="#F97316" colors={["#F97316"]} />}
          >
            {paginatedHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate("AttendanceHistoryDetailScreen", {
                date: item.date,
                attendancePeriod: item.type === "Morning" ? "Morning" : "Afternoon"
              })}
              className="flex-row items-center justify-between border border-gray-100 rounded-2xl p-4 mb-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] bg-white"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3">
                  <Ionicons name="trophy" size={18} color="#F59E0B" />
                </View>
                <View>
                  <Text className="text-base font-bold text-gray-900">{moment(item.date).format("dddd, Do MMMM, YYYY")}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{item.type} Attendance</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-gray-900">
                  {item.p + item.a ? `${Math.round((item.p / (item.p + item.a)) * 100)}% Avg.` : "0% Avg."}
                </Text>
                <View className="flex-row mt-1">
                  <Text className="text-[10px] text-green-500 font-bold mr-2">P <Text className="text-gray-500 font-normal">{item.p}</Text></Text>
                  <Text className="text-[10px] text-red-500 font-bold">A <Text className="text-gray-500 font-normal">{item.a}</Text></Text>
                </View>
              </View>
            </TouchableOpacity>
            ))}
            <View className="h-4" />

            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.max(1, Math.ceil(attendanceRows.length / ITEMS_PER_PAGE))}
              onPageChange={setCurrentPage}
            />
            <View className="h-10" />
          </ScrollView>
        )}
      </View>

      <CalendarFilterModal
        ref={calendarModalRef as any}
        selectedDate={selectedDate}
        fromDate={fromDate}
        toDate={toDate}
        onApply={(filters: any) => {
          setSelectedDate(filters?.date ?? null);
          setFromDate(filters?.fromDate ?? null);
          setToDate(filters?.toDate ?? null);
          setCurrentPage(1);
        }}
      />
    </ScreenContainer>
  );
};

export default AttendanceHistoryScreen;
