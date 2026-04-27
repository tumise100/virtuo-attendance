import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import NoDataComponent from "@/src/components/UI/NoData";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { IStudentUser } from "@/src/contracts/user";
import { GetSchoolStudents } from "@/src/services/school";
import { GetStudentAttendance } from "@/src/services/attendance";
import moment from "moment";
import { GetMyStudents, GetTeacherStudents } from "@/src/services/student";
import { StackNavigationProps, ModalProp } from "@/src/shared";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import { asArray, convertLevelStringToNumber } from "@/src/utils";
import { GetClasses } from "@/src/services/class";
import React, { useEffect, useState, useRef } from "react";
import { FlatList, StatusBar, Text, TouchableOpacity, View, Image, RefreshControl } from "react-native";
import PaginationControls from "../../components/UI/PaginationControls";
import FilterStudentModal from "@/src/components/UI/Modals/FilterStudentModal";
import { Ionicons } from "@expo/vector-icons";
import CustomAvatar from "@/src/components/UI/CustomAvatar";

// Student card mirrors the Teacher card layout used on the Teachers screen
const StudentCardItem = ({
  student,
  stats,
  onPress,
}: {
  student: any;
  stats?: { present: number; absent: number; avg: number };
  onPress: () => void;
}) => {
  const fullName = [student?.firstName, student?.lastName].filter(Boolean).join(" ") || "Student";
  const klass = student?.currentClass || student?.class;
  const classLabel = klass?.name || student?.level || "";
  const sectionLabel = klass?.section?.name || "";
  const subtitle = [classLabel, sectionLabel].filter(Boolean).join(" • ") || "Student";
  const present = stats?.present ?? 0;
  const absent = stats?.absent ?? 0;
  const avg = stats?.avg ?? 0;
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between mb-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
      <View className="flex-row items-center flex-1">
        <CustomAvatar name={fullName} size={48} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{fullName}</Text>
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="text-sm font-bold text-gray-900 mb-1">{avg}% Avg.</Text>
        <View className="flex-row items-center">
          <Text className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded mr-1">P <Text className="text-gray-500 font-normal">{present}</Text></Text>
          <Text className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">A <Text className="text-gray-500 font-normal">{absent}</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const AllStudentScreen = ({ navigation }: StackNavigationProps) => {
  // Mock Data for UI Verification
  const SAMPLE_STUDENTS: any[] = [
    { accountId: 1, firstName: "James", lastName: "Binebai", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 2, firstName: "Margaret", lastName: "Olowookere", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 3, firstName: "Grace", lastName: "Kolapo", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 4, firstName: "Deborah", lastName: "Kemepade", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 5, firstName: "Victoria", lastName: "Kuroebi", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 6, firstName: "David", lastName: "Ekisagha", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 7, firstName: "Salako", lastName: "Mary Jane", level: "JSS 1", class: { name: "JSS 1" }, department: { name: "Junior" } },
    { accountId: 8, firstName: "Salako", lastName: "Mary Jane", level: "SSS 1", class: { name: "SSS 1" }, department: { name: "Science" } },
    { accountId: 9, firstName: "Salako", lastName: "Mary Jane", level: "SSS 3", class: { name: "SSS 3" }, department: { name: "Commercial" } },
    { accountId: 10, firstName: "Salako", lastName: "Mary Jane", level: "JSS 2", class: { name: "JSS 2" }, department: { name: "Junior" } },
    { accountId: 11, firstName: "Salako", lastName: "Mary Jane", level: "JSS 2", class: { name: "JSS 2" }, department: { name: "Junior" } },
  ];

  const [allStudents, setAllStudents] = useState<IStudentUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = combineStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [classFilter, setClassFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"PRESENT" | "ABSENT" | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [todayStudentIds, setTodayStudentIds] = useState<Set<number>>(new Set());
  const [studentStats, setStudentStats] = useState<Map<number, { present: number; absent: number; avg: number }>>(new Map());

  const filterModalRef = useRef<ModalProp>(null);

  useEffect(() => {
    GetClasses()
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) setClasses(asArray(responseData));
      })
      .catch(() => {});

    GetStudentAttendance({ date: moment().format("YYYY-MM-DD") })
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) {
          const records = asArray(responseData);
          const ids = new Set<number>(
            records
              .filter((r: any) => r?.status === "PRESENT")
              .map((r: any) => r?.studentId || r?.student?.id)
              .filter(Boolean),
          );
          setTodayStudentIds(ids);
        }
      })
      .catch(() => {});

    // Compute per-student attendance stats for the last month so each
    // card can display the same P/A/avg summary that the Teachers screen
    // shows for staff.
    GetStudentAttendance({ period: "month" })
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) {
          const records = asArray(responseData);
          const counts = new Map<number, { present: number; absent: number }>();
          records.forEach((r: any) => {
            const id = r?.studentId || r?.student?.id;
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
          setStudentStats(stats);
        }
      })
      .catch(() => {});
  }, []);

  const accounts = (user?.accounts as any[]) || [];
  const staffAccount = accounts.find((a: any) => a?.type === "STAFF");
  const schoolAccount = accounts.find((a: any) => a?.type === "SCHOOL");
  const lecturerType = (accounts[0] as any)?.lecturer?.lecturerType;
  const isSecondaryInstructor = lecturerType === "SECONDARY";
  const isTertiaryInstructor = lecturerType === "TERTIARY";

  useEffect(() => {
    if (user) {
      fetchAllMyStudents();
    }
  }, [user, currentPage, perPage, searchTerm, classFilter]);

  const fetchAllMyStudents = async () => {
    if (!user) return;

    setLoading(true);
    const query: any = { page: currentPage, limit: perPage };
    if (searchTerm) query.search = searchTerm;
    if (classFilter) query.classId = classFilter;

    // Both STAFF and SCHOOL accounts can use the /student endpoint — the
    // backend scopes by the authenticated account's schoolId.
    const fetcher = isTertiaryInstructor
      ? GetMyStudents(query)
      : isSecondaryInstructor
        ? GetTeacherStudents(query)
        : GetMyStudents(query);

    await fetcher
      .then(({ responseData, responseStatus }: any) => {
        if (responseStatus === 200) {
          let rows: any[] = asArray(responseData);
          if (isTertiaryInstructor) {
            rows = rows.map((item: any) => item?.student?.student || item?.student || item);
          }
          setAllStudents(rows as any);
          const total =
            responseData?.meta?.total ??
            responseData?.meta?.totalCount ??
            responseData?.meta?.totalPages * perPage ??
            (Array.isArray(rows) ? rows.length : 0);
          setTotalCount(total);
        }
      })
      .catch((err) => {
        console.log(err?.message, "err");
      })
      .finally(() => setLoading(false));
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center mb-4 px-4">
        <BackBtn />
        <SubheadingSemibold18 text="Students" customClassName="ml-5 text-gray-900" />
      </View>

      <View className="flex-1 px-4">


        {/* Search and Filter */}
        <InputWithFilter
          filterModalRef={filterModalRef}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Attendance History Banner */}
        <TouchableOpacity
          className="bg-orange-500 rounded-xl p-4 mb-6 flex-row items-center justify-between shadow-lg shadow-orange-200"
          onPress={() => navigation.navigate("AttendanceHistoryScreen")}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3">
              <Ionicons name="trophy" size={20} color="#F97316" />
            </View>
            <Text className="text-white font-bold text-base">Attendance history</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>

        {loading ? (
          <View className="flex-1">
            <LoadingComponent />
            <LoadingComponent />
          </View>
        ) : !allStudents || allStudents.length === 0 ? (
          <NoDataComponent
            title="No Students Found"
            subtitle="Try adjusting your filters or search terms."
            onRefresh={() => fetchAllMyStudents()}
          />
        ) : (
          (() => {
            const visibleStudents = (allStudents || []).filter((s: any) => {
              if (!statusFilter) return true;
              const present = todayStudentIds.has(s?.id);
              return statusFilter === "PRESENT" ? present : !present;
            });
            return (
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-bold text-gray-900">Students</Text>
              <Text className="text-base font-bold text-gray-900">{statusFilter ? visibleStudents.length : (totalCount || 0)}</Text>
            </View>

            {visibleStudents.length ? (
              <>
                <FlatList
                  data={visibleStudents}
                  renderItem={({ item }) => (
                    <StudentCardItem
                      student={item}
                      stats={studentStats.get(item?.id)}
                      onPress={() => navigation.navigate("StudentAttendanceHistoryScreen" as any, { id: item?.id, student: item })}
                    />
                  )}
                  keyExtractor={(item: any, index: number) => `${item?.id ?? item?.accountId ?? index}`}
                  showsVerticalScrollIndicator={false}
                  refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAllMyStudents} tintColor="#F97316" colors={["#F97316"]} />}
                  ListFooterComponent={() => <View className="h-36" />}
                />

                <PaginationControls
                  currentPage={currentPage}
                  totalPages={Math.ceil((totalCount || 0) / perPage)}
                  onPageChange={setCurrentPage}
                />
                {/* Pagination can be simpler or kept if needed. Hiding for cleaner UI match unless user complains */}
                {/* <CustomPagination
                 currentPage={currentPage}
                 numberOfPage={Math.ceil(totalCount / perPage)}
                 onNextPress={() => handlePaginationNextPress(currentPage, totalCount, setCurrentPage)}
                 onPressItem={(val) => handlePaginationItemPress(val, Math.ceil(perPage / currentPage), setCurrentPage)}
                 onPrevPress={() => handlePaginationPrevPress(currentPage, totalCount, setCurrentPage)}
               /> */}
              </>
            ) : (
              <NoDataComponent
                title="No Students Found"
                subtitle="Try adjusting your filters or search terms."
                onRefresh={() => fetchAllMyStudents()}
              />
            )}
          </View>
            );
          })()
        )}

      </View>
      {/* Filter Modal */}
      <FilterStudentModal
        ref={filterModalRef}
        classes={classes}
        selectedClassId={classFilter}
        selectedStatus={statusFilter}
        onApply={(filters: any) => {
          setClassFilter(filters?.classId ?? null);
          setStatusFilter(filters?.status ?? null);
          setCurrentPage(1);
        }}
      />
    </ScreenContainer>
  );
};

export default AllStudentScreen;
