import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ScreenContainer } from "../../components/UI/ScreenContainer";
import { BackBtn } from "../../components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "../../theme/typography";
import { StackNavigationProps } from "../../shared";
import { ISecondaryClassHeader } from "../../contracts/course";
import CustomAvatar from "../../components/UI/CustomAvatar";
import { GetClassDetail } from "@/src/services/class";
import { GetMyStudents } from "@/src/services/student";
import LoadingComponent from "@/src/components/UI/LoadingComponent";

// --- Sub-Components ---

// --- Sub-Components ---

const SummarySection = ({ studentCount }: { studentCount: number }) => (
  <View className="flex-row justify-between mb-8">
    <View className="w-[48%] relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm h-20 justify-center">
      <View className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500 rounded-l-xl" />
      <Text className="text-gray-400 text-xs mb-1 ml-2">No of Students</Text>
      <Text className="text-2xl font-bold text-gray-900 ml-2">{studentCount}</Text>
    </View>

    <View className="w-[48%] relative bg-white border border-gray-100 rounded-xl p-4 shadow-sm h-20 justify-center">
      <View className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 rounded-l-xl" />
      <Text className="text-gray-400 text-xs mb-1 ml-2">Average Attendance</Text>
      <Text className="text-2xl font-bold text-gray-900 ml-2">--%</Text>
    </View>
  </View>
);

const StudentsList = ({ navigation, students }: { navigation: any, students: any[] }) => (
  <View>
    {students.map((student: any, idx: number) => {
      const fullName = [student.firstName, student.lastName].filter(Boolean).join(" ") || "Student";
      const subtitle = [student.level, student.section, student.department].filter(Boolean).join(" • ");
      return (
        <TouchableOpacity
          key={student.id ?? student.accountId ?? idx}
          onPress={() => navigation.navigate("StudentViewScreen", { id: student.id ?? student.accountId })}
          className="flex-row items-center border border-gray-100 rounded-2xl p-3 mb-3 bg-white shadow-sm"
        >
          <CustomAvatar name={fullName} size={45} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{fullName}</Text>
            <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>{subtitle || "—"}</Text>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

// --- Main Screen ---

const SecondaryClassDetailScreen = ({ route, navigation }: StackNavigationProps) => {
  const [classItemHeader, setClassItemHeader] = useState<ISecondaryClassHeader | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const classId = route?.params?.classId;

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const normalizeRows = (payload: any) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const fetchClassData = async () => {
    if (!classId) return;
    setLoading(true);
    try {
      // Load the class header first so the title renders before the
      // (potentially large) student list starts parsing.
      const classRes = await GetClassDetail(classId);
      if (classRes.responseStatus === 200 && classRes.responseData) {
        const data = classRes.responseData;
        const groupName = data?.classGroup?.name || "";
        const isJunior = /junior|primary|nursery|kg|prep/i.test(groupName);
        const facultyPiece = !isJunior && data?.faculty?.name ? data.faculty.name : groupName;
        const pieces = [data.name, data.section?.name, facultyPiece].filter(Boolean).join(" • ");
        setClassItemHeader({
          id: data.id,
          name: pieces || data.name || "Class",
          students: data.totalStudents || data.students?.length || 0,
        } as any);
      }

      const studentsRes = await GetMyStudents({ classId, limit: 200 });
      if (studentsRes.responseStatus === 200) {
        const rows = normalizeRows(studentsRes.responseData).map((student: any) => {
          const klass = student.currentClass || student.class;
          const groupName = klass?.classGroup?.name || "";
          const isJunior = /junior|primary|nursery|kg|prep/i.test(groupName);
          const facultyPiece = !isJunior ? (klass?.faculty?.name || student.faculty?.name || "") : groupName;
          return {
            id: student.id,
            accountId: student.accountId || student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            level: klass?.name || "Class",
            section: klass?.section?.name || "",
            department: facultyPiece,
          };
        });
        setStudents(rows);
      }
    } catch (error) {
      console.error("fetchClassData error:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <View className="flex-row items-center">
          <BackBtn />
          <SubheadingSemibold18 text={classItemHeader?.name || (route?.params?.className as string) || "Class"} customClassName="ml-4 text-gray-900" />
        </View>
      </View>

      <View className="flex-1 px-4">


        <SummarySection studentCount={students.length} />

        <Text className="text-lg font-bold text-gray-900 mb-4">Students</Text>
        {loading ? (
          <LoadingComponent />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchClassData} tintColor="#F97316" colors={["#F97316"]} />}
          >
            <StudentsList navigation={navigation} students={students} />
            <View className="h-20" />
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
};

export default SecondaryClassDetailScreen;
