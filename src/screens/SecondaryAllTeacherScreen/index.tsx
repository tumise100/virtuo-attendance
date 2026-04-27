import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import NoDataComponent from "../../components/UI/NoData";
import CustomAvatar from "@/src/components/UI/CustomAvatar";
import { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import PaginationControls from "../../components/UI/PaginationControls";
import { StackNavigationProps, ModalProp } from "@/src/shared";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import FilterTeacherModal from "@/src/components/UI/Modals/FilterTeacherModal";

// Teacher Card Item matching the design
const TeacherCardItem = ({
  teacher,
  stats,
  onPress,
}: {
  teacher: any;
  stats?: { present: number; absent: number; avg: number };
  onPress: () => void;
}) => {
  const fullName = [teacher.firstName, teacher.lastName].filter(Boolean).join(" ");
  const present = stats?.present ?? 0;
  const absent = stats?.absent ?? 0;
  const avg = stats?.avg ?? 0;
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between mb-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <View className="flex-row items-center flex-1">
        <CustomAvatar name={fullName} size={48} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{fullName}</Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {teacher.designation || teacher.role || "Staff"}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="text-sm font-bold text-gray-900 mb-1">{avg}% Avg.</Text>
        <View className="flex-row items-center">
          <Text className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded mr-1">P <Text className="text-gray-500 font-normal">{present}</Text></Text>
          <Text className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">A <Text className="text-gray-500 font-normal">{absent}</Text></Text>
        </View>
      </View>
    </TouchableOpacity >
  );
}

import { GetStaff } from "@/src/services/teacher";
import { GetStaffAttendance } from "@/src/services/attendance";
import LoadingComponent from "../../components/UI/LoadingComponent";
import { asArray } from "@/src/utils";
import moment from "moment";

const SecondaryAllTeacherScreen = ({
  navigation,
  route,
}: StackNavigationProps) => {
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [designationFilter, setDesignationFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"PRESENT" | "ABSENT" | null>(null);
  const [todayStaffIds, setTodayStaffIds] = useState<Set<number>>(new Set());
  const [staffStats, setStaffStats] = useState<Map<number, { present: number; absent: number; avg: number }>>(new Map());
  const filterModalRef = useRef<ModalProp>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");

    GetStaffAttendance({ date: today })
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) {
          const records = asArray(responseData);
          const ids = new Set<number>(
            records
              .filter((r: any) => r?.status === "PRESENT")
              .map((r: any) => r?.staffId || r?.staff?.id)
              .filter(Boolean),
          );
          setTodayStaffIds(ids);
        }
      })
      .catch(() => {});

    GetStaffAttendance({ period: "month" })
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) {
          const records = asArray(responseData);
          const counts = new Map<number, { present: number; absent: number }>();
          records.forEach((r: any) => {
            const id = r?.staffId || r?.staff?.id;
            if (!id) return;
            const cur = counts.get(id) || { present: 0, absent: 0 };
            if (r?.status === "PRESENT") cur.present += 1;
            else cur.absent += 1;
            counts.set(id, cur);
          });
          const stats = new Map<number, { present: number; absent: number; avg: number }>();
          counts.forEach((v, k) => {
            const total = v.present + v.absent;
            const avg = total ? Math.round((v.present / total) * 100) : 0;
            stats.set(k, { ...v, avg });
          });
          setStaffStats(stats);
        }
      })
      .catch(() => {});
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { responseData, responseStatus } = await GetStaff({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
      });
      if (responseStatus === 200) {
        const rows = asArray<any>(responseData);
        setAllTeachers(rows);
        const total =
          responseData?.meta?.total ??
          responseData?.meta?.totalCount ??
          rows.length;
        setTotalCount(total);
      }
    } catch (error) {
      console.error("fetchTeachers error:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableDesignations = useMemo(() => {
    const set = new Set<string>();
    (allTeachers || []).forEach((t) => {
      if (t?.designation) set.add(String(t.designation));
    });
    return Array.from(set);
  }, [allTeachers]);

  const paginatedTeachers = useMemo(() => {
    return (allTeachers || []).filter((t: any) => {
      if (designationFilter && t?.designation !== designationFilter) return false;
      if (statusFilter) {
        const present = todayStaffIds.has(t?.id);
        if (statusFilter === "PRESENT" && !present) return false;
        if (statusFilter === "ABSENT" && present) return false;
      }
      return true;
    });
  }, [allTeachers, designationFilter, statusFilter, todayStaffIds]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <ScreenContainer>
      <View className="flex-row items-center px-4 mb-4">
        <BackBtn />
        <SubheadingSemibold18 text="Teachers" customClassName="ml-5 text-gray-900" />
      </View>


      <View className="flex-1 px-4">
        {/* Search and Filter */}
        <InputWithFilter
          filterModalRef={filterModalRef}
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            setCurrentPage(1);
          }}
          placeHolder="Search for teacher"
        />

        {/* Attendance History Banner */}
        <TouchableOpacity
          className="bg-orange-500 rounded-xl p-4 mb-6 flex-row items-center justify-between shadow-lg shadow-orange-200"
          onPress={() => navigation.navigate("AttendanceHistoryHeaderForInstructorScreen")}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
              <Ionicons name="trophy" size={20} color="#F97316" />
            </View>
            <Text className="text-white font-bold text-base">Attendance history</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-base font-bold text-gray-900">All Teachers</Text>
          <Text className="text-base font-bold text-gray-900">{totalCount}</Text>
        </View>

        {loading ? (
          <View className="flex-1">
            <LoadingComponent />
            <LoadingComponent />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTeachers} tintColor="#F97316" colors={["#F97316"]} />}
          >
            {paginatedTeachers.length === 0 ? (
              <NoDataComponent />
            ) : (
              paginatedTeachers.map((teacher) => (
                <TeacherCardItem
                  key={teacher.accountId || teacher.id}
                  teacher={teacher}
                  stats={staffStats.get(teacher.id)}
                  onPress={() => navigation.navigate("InstructorAttendanceViewScreen", { id: teacher.id, teacher })}
                />
              ))
            )}
          </ScrollView>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </View>

      {/* Filter Modal */}
      <FilterTeacherModal
        ref={filterModalRef}
        designations={availableDesignations}
        selectedDesignation={designationFilter}
        selectedStatus={statusFilter}
        onApply={(filters: any) => {
          setDesignationFilter(filters?.designation ?? null);
          setStatusFilter(filters?.status ?? null);
        }}
      />
    </ScreenContainer>
  );
};

export default SecondaryAllTeacherScreen;
