import { View, StatusBar, FlatList, Text, RefreshControl, TextInput, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import NoDataComponent from "@/src/components/UI/NoData";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AttendanceCard from "@/src/components/UI/AttendanceCard";
import { AttendanceHistoryButton } from "../AttendanceHistoryScreen/components";
import { BodyText } from "@/src/theme/typography/BodyText";
import { TextFontType } from "@/src/theme/typography/typography";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { StackNavigationProps } from "@/src/shared";
import { EAttendancePeriod } from "@/src/contracts/attendance.d";
import {
  GetStaffAttendance,
  GetStudentAttendance,
} from "@/src/services/attendance";
import { GetMyStudents } from "@/src/services/student";
import { GetStaff } from "@/src/services/teacher";
import { combineStore } from "@/src/store";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { asArray, getClassDisplayName } from "@/src/utils";

type Row = {
  id: string;
  personId?: number;
  name: string;
  classLabel: string;
  sessionType?: string;
  entryTime?: string | null;
  exitTime?: string | null;
  attended: boolean;
};

const AttendanceHistoryDetailScreen = ({ route }: StackNavigationProps) => {
  const [date, setDate] = useState<string | null>(route?.params?.date || null);
  const [attendancePeriod, setAttendancePeriod] = useState<EAttendancePeriod | null>(
    route?.params?.attendancePeriod || null,
  );

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<Row[]>([]);
  const [totalPeople, setTotalPeople] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = combineStore();
  const account = user?.accounts?.[0] as any;
  const isSchool = account?.type === "SCHOOL";
  const schoolId = account?.school?.id || account?.school?.accountId;
  const staffId = account?.staff?.id;

  const fetchTotal = useCallback(async () => {
    try {
      if (isSchool) {
        const { responseData, responseStatus } = await GetMyStudents({ page: 1, limit: 1 });
        if (responseStatus === 200) {
          const meta = responseData?.meta;
          setTotalPeople(meta?.total ?? meta?.totalCount ?? 0);
        }
      } else {
        const { responseData, responseStatus } = await GetStaff({ page: 1, limit: 1 });
        if (responseStatus === 200) {
          const meta = responseData?.meta;
          setTotalPeople(meta?.total ?? meta?.totalCount ?? 0);
        }
      }
    } catch (error) {
      // Non-fatal: the UI will just show 0 absent until the count resolves.
    }
  }, [isSchool]);

  const fetchDay = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    try {
      const res = isSchool
        ? await GetStudentAttendance({ date })
        : await GetStaffAttendance({ date });
      if (res.responseStatus === 200) {
        const rows = asArray<any>(res.responseData);
        const mapped: Row[] = rows.map((item: any, idx: number) => {
          const entity = isSchool ? item.student : item.staff;
          const firstName = entity?.firstName || "";
          const lastName = entity?.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim() || (isSchool ? "Student" : "Staff");
          const klass = entity?.currentClass;
          const classLabel = isSchool
            ? getClassDisplayName(klass) || entity?.class?.name || ""
            : entity?.designation || "Staff";
          const attended = item.status === "PRESENT";
          return {
            id: `${item.id ?? idx}`,
            personId: entity?.id,
            name: fullName,
            classLabel,
            sessionType: item.sessionType,
            entryTime: item.sessionType === "MORNING" && attended ? item.date : null,
            exitTime: item.sessionType === "AFTERNOON" && attended ? item.date : null,
            attended,
          };
        });
        setRecords(mapped);
      }
    } catch (error) {
      console.error("fetchDay error:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [date, isSchool]);

  useEffect(() => {
    if (route?.params?.date) {
      setDate(route.params.date);
      setAttendancePeriod(route.params.attendancePeriod);
    }
  }, [route?.params?.date, route?.params?.attendancePeriod]);

  useEffect(() => {
    if (date && (schoolId || staffId)) {
      fetchDay();
      fetchTotal();
    }
  }, [date, schoolId, staffId, isSchool, fetchDay, fetchTotal]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Sequential: show the day's records as soon as they arrive, then
    // refresh the totals in the background.
    await fetchDay();
    await fetchTotal();
    setRefreshing(false);
  }, [fetchDay, fetchTotal]);

  const isMorning = attendancePeriod === EAttendancePeriod.Morning;

  // Present = unique people marked PRESENT for the selected period.
  // Absent = active students/staff minus present (falls back to 0 when the
  // total hasn't loaded yet). Mirrors the home screen counter so the card
  // counts reflect how many people still need to mark in.
  const { presentIds, presents, absents, avgPct } = useMemo(() => {
    const matched = records.filter((r) => {
      if (!r.attended) return false;
      if (!r.sessionType) return false;
      return isMorning ? r.sessionType === "MORNING" : r.sessionType === "AFTERNOON";
    });
    const set = new Set<number>();
    matched.forEach((r) => {
      if (r.personId != null) set.add(r.personId);
    });
    const p = set.size;
    const a = Math.max(0, (totalPeople || 0) - p);
    const pct = totalPeople ? Math.round((p / totalPeople) * 100) : 0;
    return { presentIds: set, presents: p, absents: a, avgPct: pct };
  }, [records, isMorning, totalPeople]);

  const peopleLabel = isSchool ? "Students" : "Staff";

  const filteredRows = useMemo(() => {
    const q = (searchTerm || "").toLowerCase().trim();
    const seen = new Set<number>();
    const list = records
      .filter((r) => (isMorning ? r.sessionType === "MORNING" : r.sessionType === "AFTERNOON"))
      // dedupe so one student isn't listed twice if the day has
      // multiple records for the same session type.
      .filter((r) => {
        if (r.personId == null) return true;
        if (seen.has(r.personId)) return false;
        seen.add(r.personId);
        return true;
      });
    if (!q) return list;
    return list.filter((r) => r.name.toLowerCase().includes(q));
  }, [records, searchTerm, isMorning]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 px-4 py-7 bg-white">
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-7">
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" animated />

      <View className="flex-row items-center">
        <BackBtn />
        <SubheadingSemibold18
          text={date ? moment(date).format("ddd, Do MMM YYYY") : "Date"}
          customClassName="ml-5"
        />
      </View>

      <AttendanceHistoryButton
        title={`${isMorning ? "Morning" : "Afternoon"} attendance`}
        leftText={`${avgPct}% avg`}
        customClassName="mt-5 bg-orange-500"
        titleClassName="text-white"
        leftTextClassName="text-white"
      />

      <View className="flex-row justify-between items-center mt-3">
        <AttendanceCard
          title="Presents"
          subtitle={`${presents} ${peopleLabel}`}
          borderColor="border-success-500"
        />
        <AttendanceCard
          title="Absents"
          subtitle={`${absents} ${peopleLabel}`}
          borderColor="border-danger-500"
        />
      </View>

      <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 mt-4">
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder={`Search for ${peopleLabel.toLowerCase()}`}
          placeholderTextColor="#9CA3AF"
          className="flex-1 py-2.5 ml-2 text-sm"
        />
        {searchTerm.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="flex-row justify-between items-center my-3">
        <BodyText text={peopleLabel} type={TextFontType.Bold} />
        <BodyText text={`${filteredRows.length}`} type={TextFontType.Bold} />
      </View>

      <FlatList
        data={filteredRows}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" colors={["#F97316"]} />}
        renderItem={({ item }) => {
          const time = isMorning ? item.entryTime : item.exitTime;
          const timeStr = time ? moment(time).format("hh:mm A") : null;
          const inOutLabel = isMorning ? "Login" : "Logout";
          return (
            <View className="flex-row items-center justify-between mb-3 border border-gray-100 rounded-2xl p-3 bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
              <View className="flex-row items-center flex-1">
                <CustomAvatar name={item.name} size={40} />
                <View className="ml-3 flex-1">
                  <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
                    {item.name}
                    {timeStr ? <Text className="text-gray-400 font-normal">  •  {inOutLabel} {timeStr}</Text> : null}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                    {item.classLabel || (isSchool ? "Class" : "Staff")}
                  </Text>
                </View>
              </View>
              <View className={`px-2 py-1 rounded-full ${item.attended ? "bg-green-50" : "bg-red-50"}`}>
                <Text className={`text-[10px] font-bold ${item.attended ? "text-green-600" : "text-red-600"}`}>
                  {item.attended ? "PRESENT" : "ABSENT"}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <NoDataComponent
            title="Attendance Not Found"
            subtitle="We couldn't find any attendance records for this date."
            onRefresh={onRefresh}
          />
        )}
        ListFooterComponent={() => <View className="h-20" />}
      />
    </View>
  );
};

export default AttendanceHistoryDetailScreen;
