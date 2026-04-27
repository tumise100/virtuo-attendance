import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import CalendarFilterModal from "@/src/components/UI/Modals/CalendarFilterModal";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { GetStaffAttendance } from "@/src/services/attendance";
import moment from "moment";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

const AttendanceHistoryHeaderForInstructorScreen = ({
  navigation,
}: StackNavigationProps) => {
  const calendarRef = useRef<ModalProp>(null);
  const [attendanceRows, setAttendanceRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAttendanceHeader();
  }, []);

  const fetchAttendanceHeader = async () => {
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetStaffAttendance({ period: "week" });
      if (responseStatus === 200) {
        const records = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];
        const grouped = new Map<string, any>();
        records.forEach((item: any) => {
          const dateKey = moment(item.date).format("YYYY-MM-DD");
          const type = item.sessionType === "AFTERNOON" ? "Afternoon" : "Morning";
          const key = `${dateKey}-${type}`;
          if (!grouped.has(key)) {
            grouped.set(key, { id: key, date: dateKey, type, presents: 0, absents: 0 });
          }
          const row = grouped.get(key);
          if (item.status === "PRESENT") row.presents += 1;
          else row.absents += 1;
        });

        setAttendanceRows(Array.from(grouped.values()).sort((a: any, b: any) => (a.date < b.date ? 1 : -1)));
      }
    } catch (error) {
      console.error("fetchAttendanceHeader error:", error);
      setAttendanceRows([]);
    } finally {
      setLoading(false);
    }
  };

  const totalTeachers = attendanceRows.reduce((acc, row) => acc + row.presents + row.absents, 0);
  const totalPresent = attendanceRows.reduce((acc, row) => acc + row.presents, 0);
  const avg = totalTeachers ? Math.round((totalPresent / totalTeachers) * 100) : 0;

  return (
    <View className="flex-1 bg-white px-4 pt-14">
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle={"dark-content"}
        animated
      />

      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <BackBtn />
          <SubheadingSemibold18 text="Attendance history" customClassName="ml-5 text-gray-900" />
        </View>
        <TouchableOpacity
          onPress={() => calendarRef.current?.setVisible(true)}
          className="p-2 border border-gray-200 rounded-full"
        >
          <Ionicons name="calendar-outline" size={20} color={COLORS.gray3} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-8">
        <View className="w-[48%] relative bg-white border border-gray-200 border-l-orange-500 border-l-4 rounded-xl p-4 shadow-sm">
          <View className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500 rounded-l-xl" />
          <Text className="text-gray-500 text-sm mb-1 ml-1">Total Teachers</Text>
          <Text className="text-2xl font-bold text-black ml-1">{totalTeachers}</Text>
        </View>

        <View className="w-[48%] relative bg-white border border-blue-200 rounded-xl p-4 shadow-sm overflow-hidden">
          <View className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500" />
          <Text className="text-gray-500 text-sm mb-1 ml-2">Average attendance</Text>
          <Text className="text-2xl font-bold text-black ml-2">{avg}%</Text>
        </View>
      </View>

      <View className="flex-1">
        <Text className="text-base font-bold text-gray-900 mb-4">Attendance</Text>
        {loading ? (
          <LoadingComponent />
        ) : (
          <FlatList
          data={attendanceRows}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AttendanceHistoryDetailForInstructorScreen", {
                date: item.date,
                attendancePeriod: item.type === "Morning" ? "Morning" : "Afternoon"
              })}
              className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm flex-row items-center justify-between"
            >
              {/* Left: Icon and Basic Info */}
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center mr-3">
                  <Ionicons name="trophy" size={18} color="#F59E0B" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-gray-900">{moment(item.date).format("dddd, Do MMMM, YYYY")}</Text>
                  <Text className="text-xs text-gray-500">{item.type} Attendance</Text>
                </View>
              </View>

              {/* Right: Stats */}
              <View className="items-end">
                <Text className="text-sm font-bold text-gray-900">
                  {item.presents + item.absents
                    ? `${Math.round((item.presents / (item.presents + item.absents)) * 100)}% Avg.`
                    : "0% Avg."}
                </Text>
                <View className="flex-row mt-1">
                  <Text className="text-[10px] text-green-500 mr-2">P {item.presents}</Text>
                  <Text className="text-[10px] text-red-500">A {item.absents}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View className="h-10" />}
        />
        )}
      </View>

      <CalendarFilterModal ref={calendarRef} />

    </View>
  );
};

export default AttendanceHistoryHeaderForInstructorScreen;
