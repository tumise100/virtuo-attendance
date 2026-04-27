import { View, Text, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, ActivityIndicator, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { ScreenContainer } from "../../components/UI/ScreenContainer";
import { BackBtn } from "../../components/UI/Buttons/BackBtn";
import { COLORS } from "../../theme/colors/index";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProps } from "../../shared";
import CustomAvatar from "../../components/UI/CustomAvatar";
import { GetAStudent, UpdateStudent } from "../../services/student";
import { GetResults } from "../../services/results";
import { GetStudentFees, GetStudentTransactions } from "../../services/finance";
import { GetIdCardSettings, GetSchoolProfile } from "../../services/school";
import { getStudentFacultyLabel } from "../../utils";
import { showToast } from "../../components/UI/showToast";
import moment from "moment";

// --- Types ---
type TabType = 'info' | 'test' | 'payment';

// --- Sub-Components ---

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <View className="mb-4 w-[48%]">
    <Text className="text-gray-500 text-xs mb-0.5">{label}</Text>
    <Text className="text-gray-900 font-medium text-sm" numberOfLines={1}>{value || 'N/A'}</Text>
  </View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <View className="mb-4 border-b border-gray-100 pb-2 mt-2">
    <Text className="text-base font-bold text-gray-900">{title}</Text>
  </View>
);

// Admin-Style VCard
const StudentInfoCard = ({ student, fees }: { student: any, fees: any }) => {
  const klass = student?.currentClass || student?.class;
  const classLabel = [klass?.name, klass?.section?.name].filter(Boolean).join(" ");
  const facultyLabel = getStudentFacultyLabel(student);
  const primaryGuardian =
    (Array.isArray(student?.guardians) ? student.guardians[0] : null) || {};
  const fullName = [student?.firstName, student?.lastName].filter(Boolean).join(" ") || "Student";
  // Backend returns /student/{id}/fees as [{ totalAmount, paidAmount, dueAmount, ... }]
  // Pick the summary and read dueAmount; fall back to 0 so we never print undefined.
  const feeSummary = Array.isArray(fees) ? fees[0] : fees;
  const totalAmount = Number(feeSummary?.totalAmount ?? feeSummary?.totalFee ?? 0);
  const paidAmount = Number(feeSummary?.paidAmount ?? feeSummary?.paid ?? 0);
  const dueAmount = Number(
    feeSummary?.dueAmount ??
      feeSummary?.totalOutstanding ??
      feeSummary?.balance ??
      Math.max(0, totalAmount - paidAmount),
  );
  const formatNaira = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
  <View className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
    <View className="p-4 flex-row items-start">
      <View className="mr-4 items-center pt-2">
        <View className="border-2 border-indigo-100 rounded-full p-0.5">
          {student?.image ? (
            <Image source={{ uri: student.image }} style={{ width: 64, height: 64, borderRadius: 32 }} />
          ) : (
            <CustomAvatar name={fullName} size={64} textSize={22} />
          )}
        </View>
      </View>

      <View className="flex-1 flex-row flex-wrap">
        <InfoRow label="First Name" value={student?.firstName} />
        <InfoRow label="Surname" value={student?.lastName} />
        <InfoRow label="Class" value={classLabel || "—"} />
        <InfoRow label="Student ID" value={student?.registrationNumber || (student?.id ? String(student.id) : "")} />

        <View className="mb-4 w-[48%]">
          <Text className="text-gray-500 text-xs mb-0.5">Status</Text>
          <View className={`self-start px-2 py-0.5 rounded ${student?.status === 'ACTIVE' ? 'bg-green-100' : student?.status === 'SUSPENDED' ? 'bg-yellow-100' : 'bg-red-100'}`}>
            <Text className={`text-xs font-bold ${student?.status === 'ACTIVE' ? 'text-green-700' : student?.status === 'SUSPENDED' ? 'text-yellow-700' : 'text-red-700'}`}>
              {student?.status || "—"}
            </Text>
          </View>
        </View>

        <InfoRow label="Gender" value={student?.gender} />
        <InfoRow label="Faculty" value={facultyLabel} />
        <InfoRow label="Guardian" value={primaryGuardian?.name || student?.guardianName} />
        <InfoRow label="Guardian Phone" value={primaryGuardian?.phone || student?.guardianPhone} />
        <InfoRow label="Email" value={student?.email} />
        <InfoRow label="Phone" value={student?.phone} />
        <InfoRow label="Enrolment" value={student?.createdAt ? moment(student.createdAt).format('DD/MM/YYYY') : ""} />
      </View>
    </View>

    <View className="bg-gray-50 p-4 border-t border-gray-100 flex-row items-center justify-between">
      <View>
        <Text className="text-gray-500 text-xs">Outstanding Balance</Text>
        <Text className={`font-bold text-lg ${dueAmount > 0 ? 'text-red-500' : 'text-green-600'}`}>
          ₦{formatNaira(dueAmount)}
        </Text>
        {totalAmount > 0 ? (
          <Text className="text-gray-400 text-[10px] mt-0.5">Paid ₦{formatNaira(paidAmount)} of ₦{formatNaira(totalAmount)}</Text>
        ) : null}
      </View>
      <TouchableOpacity className="bg-orange-500 px-6 py-2.5 rounded-lg active:bg-orange-600">
        <Text className="text-white font-bold text-sm">Pay Fee</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
};

const TabSwitcher = ({ activeTab, onTabChange }: { activeTab: TabType, onTabChange: (tab: TabType) => void }) => {
  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'test', label: 'Test & Exam' },
    { id: 'payment', label: 'Payment' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row mb-6 border-b border-gray-100"
      contentContainerStyle={{ paddingBottom: 1 }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => onTabChange(tab.id as TabType)}
          className={`mr-8 pb-3 border-b-2 ${activeTab === tab.id ? 'border-orange-500' : 'border-transparent'}`}
        >
          <Text className={`font-medium text-base ${activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'}`}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// --- Tabs Content ---

// Port of the admin board CardTemplate (Card 2 / Classic Border, portrait).
// Intentionally mirrors src/features/school/components/CardTemplate.tsx so
// the mobile preview matches the printed ID card produced from the dashboard.
const StudentIdCardPreview = ({ student, school, cardSettings }: { student: any, school: any, cardSettings?: any }) => {
  const primaryColor = cardSettings?.primaryColor || school?.cardPrimaryColor || "#FF544E";
  const accentColor = "#FF6B00";
  const logoUri =
    cardSettings?.logo || school?.idCardLogo || school?.logoVertical || school?.logoMobile || school?.logoMain || null;

  const schoolName = school?.institutionName || school?.name || "School Name";

  const rawName =
    student?.name ||
    [student?.firstName, student?.middleName, student?.lastName].filter(Boolean).join(" ") ||
    "Student";
  const parts = rawName.trim().split(/\s+/);
  const lastName = parts.length > 1 ? parts[parts.length - 1] : rawName;
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : "";
  const studentId = student?.matric || student?.registrationNumber || "N/A";
  const cardHexId = (student?.nfcCode || "").toString().toUpperCase();

  // Fixed portrait aspect ratio mirrors the admin preview (280 x 440)
  return (
    <View className="self-center" style={{ width: 280 }}>
      <View
        className="rounded-2xl overflow-hidden bg-white"
        style={{
          aspectRatio: 280 / 440,
          borderWidth: 8,
          borderColor: primaryColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View className="flex-1 bg-white rounded-xl" style={{ borderWidth: 3, borderColor: accentColor }}>
          {/* Top: logo + school name */}
          <View className="items-center pt-3 px-3">
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={{ width: 40, height: 40 }} resizeMode="contain" />
            ) : (
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: primaryColor }}>
                <Text className="text-white font-bold">{(schoolName[0] || "S").toUpperCase()}</Text>
              </View>
            )}
            <Text
              className="text-center text-[13px] font-bold leading-tight mt-1 px-2"
              style={{ color: primaryColor }}
              numberOfLines={2}
            >
              {schoolName}
            </Text>
          </View>

          {/* Square student photo */}
          <View className="flex-1 items-center justify-center py-2">
            <View
              className="rounded-lg bg-gray-100 overflow-hidden items-center justify-center"
              style={{ width: 130, height: 160, borderWidth: 2, borderColor: "#E5E7EB" }}
            >
              {student?.image ? (
                <Image source={{ uri: student.image }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <CustomAvatar name={rawName} size={120} textSize={36} />
              )}
            </View>
          </View>

          {/* Name and reg */}
          <View className="items-center px-3">
            <Text className="text-[17px] text-gray-900 text-center" numberOfLines={2}>
              <Text className="font-bold">{lastName.toUpperCase()} </Text>
              {firstName ? <Text className="italic">{firstName}</Text> : null}
            </Text>
            <Text className="text-[13px] text-gray-500 mt-0.5 font-semibold">Reg: {studentId}</Text>
            <Text className="text-[10px] text-gray-400 mt-1" numberOfLines={1}>virtuo.virtuobusiness.com</Text>
          </View>

          {/* Footer band with hex code + QR placeholder */}
          <View
            className="flex-row items-center justify-between mx-3 mb-3 mt-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: primaryColor }}
          >
            <Ionicons name="wifi" size={18} color="rgba(255,255,255,0.8)" style={{ transform: [{ rotate: "90deg" }] }} />
            <View className="flex-row items-center">
              {cardHexId ? (
                <Text className="text-[8px] font-mono text-white/90 mr-2">{cardHexId}</Text>
              ) : null}
              <View className="w-9 h-9 bg-white rounded-lg items-center justify-center">
                <Text className="text-[8px] text-gray-400">QR</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const InfoTab = ({ student, fees, school, cardSettings }: { student: any, fees: any, school: any, cardSettings?: any }) => (
  <View>
    <StudentInfoCard student={student} fees={fees} />

    <SectionHeader title="ID Card Preview" />
    <View className="mb-8">
      <StudentIdCardPreview student={student} school={school} cardSettings={cardSettings} />
    </View>
  </View>
);

const toNum = (v: any) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

type SubjectRow = {
  subjectId: string | number;
  subject: string;
  test1: number;
  test1Max: number;
  test2: number;
  test2Max: number;
  test3: number;
  test3Max: number;
  exam: number;
  examMax: number;
  totalObtained: number;
  totalObtainable: number;
  percentage: number;
  grade: string;
};

// Mirrors the admin Test & Exam tab grouping so rows are one-per-subject
// with the first three "Test" entries filling Test 1-3 and the first "Exam"
// entry filling the Exam column. Totals come from the backend when set,
// otherwise we fall back to the sum of individual scores.
const buildSubjectRows = (results: any[], student: any): SubjectRow[] => {
  const grouped = new Map<string, any[]>();
  (results || []).forEach((r: any) => {
    const key = String(r?.subjectId ?? r?.subject?.id ?? r?.subject?.name ?? "unknown");
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  });

  const getGrade = (pct: number) => {
    if (pct >= 75) return "A1";
    if (pct >= 70) return "B2";
    if (pct >= 65) return "B3";
    if (pct >= 60) return "C4";
    if (pct >= 55) return "C5";
    if (pct >= 50) return "C6";
    if (pct >= 45) return "D7";
    if (pct >= 40) return "E8";
    return "F9";
  };
  const testWeight = toNum(student?.school?.testWeight) || 40;
  const examWeight = toNum(student?.school?.examWeight) || 60;

  return Array.from(grouped.entries()).map(([subjectId, rows]) => {
    const subjectName = rows[0]?.subject?.name || "Unknown Subject";
    const sorted = (arr: any[]) =>
      [...arr].sort((a, b) => {
        const da = a?.exam?.date ? new Date(a.exam.date).getTime() : 0;
        const db = b?.exam?.date ? new Date(b.exam.date).getTime() : 0;
        return da - db || (a?.id ?? 0) - (b?.id ?? 0);
      });

    const tests = sorted(rows.filter((r: any) => r?.exam?.type === "Test"));
    const exams = sorted(rows.filter((r: any) => r?.exam?.type === "Exam"));

    const t = (i: number) => ({
      score: toNum(tests[i]?.total ?? tests[i]?.obtainedMark),
      max: toNum(tests[i]?.exam?.totalMarks) || (tests[i] ? 100 : 0),
    });
    const t1 = t(0), t2 = t(1), t3 = t(2);
    const examScore = toNum(exams[0]?.total ?? exams[0]?.obtainedMark);
    const examMax = toNum(exams[0]?.exam?.totalMarks) || (exams[0] ? 100 : 0);

    const testObtained = t1.score + t2.score + t3.score;
    const testObtainable = t1.max + t2.max + t3.max;
    const totalObtained = testObtained + examScore;
    const totalObtainable = testObtainable + examMax;
    const testPart = testObtainable > 0 ? (testObtained / testObtainable) * testWeight : 0;
    const examPart = examMax > 0 ? (examScore / examMax) * examWeight : 0;
    const percentage = Math.round(testPart + examPart);

    const dbGrade = typeof exams[0]?.grade === "string" && exams[0].grade.trim() ? exams[0].grade.trim() : "";

    return {
      subjectId,
      subject: subjectName,
      test1: t1.score,
      test1Max: t1.max || 100,
      test2: t2.score,
      test2Max: t2.max || 100,
      test3: t3.score,
      test3Max: t3.max || 100,
      exam: examScore,
      examMax: examMax || 100,
      totalObtained,
      totalObtainable: totalObtainable || 100,
      percentage,
      grade: dbGrade || getGrade(percentage),
    };
  });
};

const SubjectResultCard = ({ row }: { row: SubjectRow }) => {
  const passing = row.grade.startsWith("A") || row.grade.startsWith("B");
  return (
    <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-3 border-b border-gray-100 pb-2">
        <Text className="font-bold text-gray-900 text-base flex-1" numberOfLines={1}>{row.subject}</Text>
        <View className={`px-2 py-0.5 rounded ${passing ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-bold ${passing ? 'text-green-700' : 'text-gray-700'}`}>{row.grade}</Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-3">
        <View className="items-center w-1/5">
          <Text className="text-gray-400 text-[10px] uppercase">Test 1</Text>
          <Text className="text-gray-900 font-medium">{row.test1}/{row.test1Max}</Text>
        </View>
        <View className="items-center w-1/5">
          <Text className="text-gray-400 text-[10px] uppercase">Test 2</Text>
          <Text className="text-gray-900 font-medium">{row.test2}/{row.test2Max}</Text>
        </View>
        <View className="items-center w-1/5">
          <Text className="text-gray-400 text-[10px] uppercase">Test 3</Text>
          <Text className="text-gray-900 font-medium">{row.test3}/{row.test3Max}</Text>
        </View>
        <View className="items-center w-1/5">
          <Text className="text-gray-400 text-[10px] uppercase">Exam</Text>
          <Text className="text-gray-900 font-medium">{row.exam}/{row.examMax}</Text>
        </View>
        <View className="items-center w-1/5 bg-gray-50 rounded py-1">
          <Text className="text-gray-500 text-[10px] uppercase">Total</Text>
          <Text className="text-gray-900 font-bold">{row.percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const TestTab = ({ results, student }: { results: any[]; student: any }) => {
  const rows = React.useMemo(
    () => buildSubjectRows(Array.isArray(results) ? results : [], student),
    [results, student],
  );
  return (
    <View>
      <SectionHeader title="Academic Results" />
      {rows.length === 0 ? (
        <View className="bg-gray-50 rounded-xl p-8 items-center">
          <Text className="text-gray-400">No results recorded yet</Text>
        </View>
      ) : (
        rows.map((row) => <SubjectResultCard key={row.subjectId} row={row} />)
      )}
    </View>
  );
};

const TransactionCard = ({ transaction }: { transaction: any }) => (
  <View className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm flex-row justify-between items-center">
    <View className="flex-1">
      <Text className="text-gray-400 text-xs mb-1">{moment(transaction.createdAt).format('DD MMM YYYY')}</Text>
      <Text className="text-gray-900 font-medium text-base mb-1" numberOfLines={1}>{transaction.fee?.name || 'Payment'}</Text>
      <View className={`self-start px-2 py-0.5 rounded text-[10px] font-bold ${transaction.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        <Text className={transaction.status === 'SUCCESS' ? 'text-green-700' : 'text-yellow-700'}>{transaction.status}</Text>
      </View>
    </View>

    <View className="items-end ml-4">
      <Text className="text-gray-900 font-bold text-lg mb-2">₦{transaction.amount}</Text>
      <TouchableOpacity className="flex-row items-center">
        <Ionicons name="download-outline" size={14} color="#EA580C" />
        <Text className="text-orange-600 text-xs font-medium ml-1">Receipt</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PaymentTab = ({ transactions }: { transactions: any[] }) => (
  <View>
    <SectionHeader title="Payment History" />
    {transactions.length === 0 ? (
       <View className="bg-gray-50 rounded-xl p-8 items-center">
          <Text className="text-gray-400">No transaction history</Text>
       </View>
    ) : transactions.map((tx) => (
      <TransactionCard key={tx.id} transaction={tx} />
    ))}
  </View>
);

// --- Options Modal ---

const ModalOption = ({ icon, label, color = "black", onPress }: { icon: any, label: string, color?: string, onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 border-b border-gray-50 active:bg-gray-50">
    <View className="w-10 items-center">
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text className="text-base font-medium ml-3" style={{ color }}>{label}</Text>
  </TouchableOpacity>
);

const OptionsModal = ({ visible, onClose, onAction }: { visible: boolean, onClose: () => void, onAction: (type: string) => void }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 bg-black/40 justify-end">
        <TouchableWithoutFeedback>
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
            <Text className="text-lg font-bold text-gray-900 mb-2 px-2">Manage Student</Text>

            <ModalOption icon="document-text-outline" label="Add Result" onPress={() => onAction('add-result')} />
            <ModalOption icon="cloud-download-outline" label="Download Report" onPress={() => onAction('download-report')} />
            <ModalOption icon="card-outline" label="Mark ID Printed" onPress={() => onAction('mark-id')} />
            <ModalOption icon="create-outline" label="Edit Profile" onPress={() => onAction('edit')} />
            <ModalOption icon="ban-outline" label="Suspend Student" color="#EF4444" onPress={() => onAction('suspend')} />
            <ModalOption icon="trash-outline" label="Deactivate" color="#EF4444" onPress={() => onAction('deactivate')} />

            <TouchableOpacity onPress={onClose} className="mt-4 items-center py-3">
              <Text className="text-gray-500 font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// --- Main Screen ---

const StudentViewScreen = ({ navigation, route }: StackNavigationProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);
  const [cardSettings, setCardSettings] = useState<any>(null);
  const [schoolProfile, setSchoolProfile] = useState<any>(null);

  const studentId = route?.params?.id;

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  useEffect(() => {
    GetIdCardSettings()
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) setCardSettings(responseData);
      })
      .catch(() => {});
    GetSchoolProfile()
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200) setSchoolProfile(responseData);
      })
      .catch(() => {});
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    // Load in sequence so the student header can paint first and the
    // remaining tabs hydrate without spiking the JS thread with four
    // concurrent parsers. Each step is wrapped so one failure doesn't
    // block the others.
    const safe = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try { return await fn(); } catch (e) { console.error(e); return null; }
    };

    const sRes = await safe(() => GetAStudent(studentId));
    if (sRes?.responseStatus === 200) {
      const payload = sRes.responseData;
      setStudent(payload?.data ?? payload);
    } else {
      showToast("Failed to load student data");
    }

    const rRes = await safe(() => GetResults({ studentId }));
    const rData = rRes?.responseData;
    setResults(
      Array.isArray(rData) ? rData : Array.isArray(rData?.data) ? rData.data : [],
    );

    const fRes = await safe(() => GetStudentFees(studentId));
    const fData = fRes?.responseData;
    setFees(fData?.data ?? fData ?? null);

    const tRes = await safe(() => GetStudentTransactions(studentId));
    const tData = tRes?.responseData;
    setTransactions(
      Array.isArray(tData) ? tData : Array.isArray(tData?.data) ? tData.data : [],
    );

    setLoading(false);
  };

  const handleAction = async (type: string) => {
    setModalVisible(false);
    switch (type) {
      case 'add-result':
        if (!student?.id) {
          showToast("Student not loaded yet");
          return;
        }
        navigation.navigate('ManageResultScreen' as any, { studentId: student.id });
        break;
      case 'deactivate':
        try {
          const { responseStatus } = await UpdateStudent(student.id, { status: 'INACTIVE' });
          if (responseStatus === 200) {
            showToast("Student deactivated");
            fetchStudentData();
          }
        } catch (e) {
          showToast("Operation failed");
        }
        break;
      case 'suspend':
        try {
          const { responseStatus } = await UpdateStudent(student.id, { status: 'SUSPENDED' });
          if (responseStatus === 200) {
            showToast("Student suspended");
            fetchStudentData();
          }
        } catch (e) {
          showToast("Operation failed");
        }
        break;
      default:
        showToast("Action not implemented yet");
    }
  };

  const renderContent = () => {
    if (!student) return null;
    const school = schoolProfile || student?.school || null;
    switch (activeTab) {
      case 'info': return <InfoTab student={student} fees={fees} school={school} cardSettings={cardSettings} />;
      case 'test': return <TestTab results={results} student={student} />;
      case 'payment': return <PaymentTab transactions={transactions} />;
      default: return <InfoTab student={student} fees={fees} school={school} cardSettings={cardSettings} />;
    }
  };

  if (loading && !student) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.orange500} />
          <Text className="mt-4 text-gray-500">Loading student profile...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!student && !loading) {
     return (
        <ScreenContainer>
          <View className="flex-1 justify-center items-center px-6">
            <Ionicons name="alert-circle-outline" size={64} color="gray" />
            <Text className="mt-4 text-lg font-bold text-gray-900">Student not found</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-orange-500 px-6 py-2 rounded-lg">
                <Text className="text-white font-bold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
     )
  }
  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 mb-2">
        <View className="flex-row items-center py-2">
          <BackBtn />
          <Text className="text-lg font-bold text-gray-900 ml-4">All Students</Text>
        </View>

        <TouchableOpacity
          className="p-2 bg-gray-50 border border-gray-200 rounded-lg"
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4">


        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-2"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStudentData} tintColor="#F97316" colors={["#F97316"]} />}
        >
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          {renderContent()}
          <View className="h-24" />
        </ScrollView>
      </View>
      <OptionsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScreenContainer>
  );
};

export default StudentViewScreen;
