import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Image, TextInput, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import CustomAvatar from '../../components/UI/CustomAvatar';
import PaginationControls from '../../components/UI/PaginationControls';
import { StackNavigationProps } from '../../shared';
import NoDataComponent from '../../components/UI/NoData';
import { ScreenContainer } from '../../components/UI/ScreenContainer';
import { PrimaryButton } from '../../components/UI/Buttons/PrimaryButton';
import { BackBtn } from '../../components/UI/Buttons/BackBtn';
import { GetResults, CreateResult, UpdateResult as UpdateResultApi, BulkUploadResults, GetResultTemplate } from '@/src/services/results';
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { GetSessions, GetTerms } from '@/src/services/academic-session';
import { GetMyStudents } from '@/src/services/student';
import { GetExams } from '@/src/services/exam';
import * as DocumentPicker from 'expo-document-picker';
import { showToast } from '@/src/components/UI/showToast';
import { asArray, getClassDisplayName } from '@/src/utils';
import DraggableBottomSheet from '@/src/components/UI/DraggableBottomSheet';

// --- Types ---
type StudentResult = {
    id: number;
    obtainedMark: number;
    totalMark: number;
    total?: number;
    grade?: string;
    remark?: string;
    examId?: number;
    exam?: {
        id?: number;
        term?: string;
        termName?: string;
        session?: string;
        sessionName?: string;
        academicSession?: { name?: string };
        totalMarks?: number;
    };
    student: {
        id: number;
        firstName: string;
        lastName: string;
        registrationNumber: string;
        image?: string;
    };
    class: {
        id: number;
        name: string;
    };
    subject: {
        id: number;
        name: string;
    };
};

const normalizeExamLabel = (exam: any) => {
    const rawName = String(exam?.name || "").trim();
    const rawType = String(exam?.type || "").trim().toLowerCase();
    const lowerName = rawName.toLowerCase();

    if (lowerName.includes("first")) return "First Test";
    if (lowerName.includes("second")) return "Second Test";
    if (lowerName.includes("third")) return "Third Test";
    if (lowerName.includes("final") || rawType === "exam") return "Final Exam";
    if (rawName) return rawName;
    if (rawType === "test") return "Test";
    return "Exam";
};

const examSortOrder = (label: string) => {
    switch (label) {
        case "First Test":
            return 1;
        case "Second Test":
            return 2;
        case "Third Test":
            return 3;
        case "Final Exam":
            return 4;
        default:
            return 99;
    }
};

const getUniqueExamOptions = (exams: any[], selectedClass?: any, selectedSubject?: any) => {
    const filtered = (exams || []).filter((exam: any) => {
        const matchesClass = !selectedClass || String(exam?.classId || "") === String(selectedClass);
        const matchesSubject = !selectedSubject || String(exam?.subjectId || "") === String(selectedSubject);
        return matchesClass && matchesSubject;
    });

    const uniqueByLabel = new Map<string, any>();
    filtered.forEach((exam: any) => {
        const label = normalizeExamLabel(exam);
        const current = uniqueByLabel.get(label);
        if (!current) {
            uniqueByLabel.set(label, exam);
            return;
        }

        const currentHasScope = current?.classId && current?.subjectId;
        const nextHasScope = exam?.classId && exam?.subjectId;
        if (!currentHasScope && nextHasScope) {
            uniqueByLabel.set(label, exam);
            return;
        }

        if ((exam?.id || 0) > (current?.id || 0)) {
            uniqueByLabel.set(label, exam);
        }
    });

    return Array.from(uniqueByLabel.entries())
        .map(([label, exam]) => ({
            id: exam.id,
            label,
            totalMarks: exam?.totalMarks,
            raw: exam,
        }))
        .sort((a, b) => examSortOrder(a.label) - examSortOrder(b.label) || a.label.localeCompare(b.label));
};

// --- Sub-Components ---
const FilterDropdown = ({ label, value, options, onSelect, placeholder = "Select" }: { label: string, value: string, options: { label: string, value: any }[], onSelect: (val: any) => void, placeholder?: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View className="mb-4">
            <Text className="text-gray-500 text-xs mb-1 font-medium">{label}</Text>
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-3"
            >
                <Text className="text-gray-900 font-medium">{value || placeholder}</Text>
                <Ionicons name="chevron-down" size={16} color="gray" />
            </TouchableOpacity>

            {isOpen && (
                <View className="absolute top-[65px] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1 max-h-60">
                    <ScrollView nestedScrollEnabled>
                        {options.map((opt, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => { onSelect(opt.value); setIsOpen(false); }}
                                className="p-3 border-b border-gray-50 last:border-0"
                            >
                                <Text className="text-gray-700">{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

// --- Modals ---
const UpdateResultModal = ({ visible, onClose, classes, subjects, terms, onRefresh, initialData = null, preSelectedStudentId = null }: { 
    visible: boolean, 
    onClose: () => void, 
    classes: any[], 
    subjects: any[], 
    terms: any[],
    onRefresh: () => void,
    initialData?: StudentResult | null,
    preSelectedStudentId?: number | null
}) => {
    const [score, setScore] = useState("");
    const [totalMark, setTotalMark] = useState("100");
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [selectedTerm, setSelectedTerm] = useState<any>(null);
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const examOptions = useMemo(
        () => getUniqueExamOptions(exams, selectedClass, selectedSubject),
        [exams, selectedClass, selectedSubject]
    );

    useEffect(() => {
        if (visible) {
            GetExams()
                .then(({ responseData, responseStatus }) => {
                    if (responseStatus === 200) setExams(asArray<any>(responseData));
                })
                .catch(() => {});
            if (initialData) {
                setScore(String(initialData?.obtainedMark ?? initialData?.total ?? ""));
                setTotalMark(String(initialData?.totalMark ?? initialData?.exam?.totalMarks ?? "100"));
                setSelectedClass(initialData?.class?.id ?? null);
                setSelectedSubject(initialData?.subject?.id ?? null);
                setSelectedTerm(null);
                setSelectedExam((initialData as any)?.examId ?? (initialData as any)?.exam?.id ?? null);
                setSelectedStudent(initialData?.student?.id ?? null);
            } else {
                setScore("");
                setTotalMark("100");
                setSelectedClass(null);
                setSelectedSubject(null);
                setSelectedTerm(null);
                setSelectedExam(null);
                setSelectedStudent(preSelectedStudentId);
            }
        }
    }, [visible, initialData, preSelectedStudentId]);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    const fetchStudents = async (classId: number) => {
        setLoading(true);
        try {
            const { responseData, responseStatus } = await GetMyStudents({ classId });
            if (responseStatus === 200) {
                setStudents(asArray(responseData));
            }
        } catch (error) {
            console.error("fetchStudents error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const { responseData, responseStatus } = await GetResultTemplate();
            if (responseStatus === 200) {
                const header = responseData.header;
                const example = responseData.example;
                const csvContent = `${header}\n${example}`;
                
                // For now, let's just alert the header or show a success message
                // In a real app, we'd use FileSystem and Sharing
                Alert.alert("Template Format", `Please use a CSV with these columns:\n\n${header}\n\nExample:\n${example}`);
            }
        } catch (error) {
            console.error("handleDownloadTemplate error:", error);
            showToast("Failed to get template");
        }
    };

    const handleUploadBulk = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/csv', 'application/vnd.ms-excel', 'text/comma-separated-values'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            const formData = new FormData();
            
            // @ts-ignore
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'text/csv',
            });

            setSubmitting(true);
            const { responseData, responseStatus } = await BulkUploadResults(formData);
            if (responseStatus === 200 || responseStatus === 201) {
                showToast(`Successfully uploaded ${responseData.success} results`);
                if (responseData.failed > 0) {
                    Alert.alert("Partial Success", `Failed to upload ${responseData.failed} records. Errors:\n${responseData.errors.join('\n')}`);
                }
                onRefresh();
                onClose();
            } else {
                showToast(responseData.message || "Bulk upload failed");
            }
        } catch (error) {
            console.error("handleUploadBulk error:", error);
            showToast("An error occurred during upload");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedStudent || !selectedSubject || !score) {
            showToast("Please fill all fields");
            return;
        }

        setSubmitting(true);
        try {
            const pickedExam = examOptions.find((exam) => exam.id === selectedExam)?.raw
                || exams.find((exam: any) => exam.id === selectedExam);
            const resolvedTerm = pickedExam?.term || pickedExam?.termName || initialData?.exam?.term || "Term";
            const resolvedSession = pickedExam?.session || pickedExam?.sessionName || pickedExam?.academicSession?.name || "Session";
            const data: any = {
                studentId: selectedStudent,
                subjectId: selectedSubject,
                obtainedMark: parseFloat(score),
                totalMark: parseFloat(totalMark),
                total: parseFloat(score),
                score: parseFloat(score),
                classId: selectedClass,
                term: resolvedTerm,
                session: resolvedSession,
            };
            if (selectedExam) data.examId = selectedExam;
            if (selectedTerm) data.termId = selectedTerm;

            let response;
            if (initialData) {
                response = await UpdateResultApi(initialData.id, data);
            } else {
                if (!selectedExam) {
                    showToast("Please select a Test or Exam");
                    setSubmitting(false);
                    return;
                }
                response = await CreateResult(data);
            }

            const { responseData, responseStatus } = response;

            if (responseStatus === 201 || responseStatus === 200) {
                showToast(initialData ? "Result updated successfully" : "Result created successfully");
                onRefresh();
                onClose();
            } else {
                showToast(responseData.message || "Failed to save result");
            }
        } catch (error) {
            console.error("handleSubmit error:", error);
            showToast("An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/40 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-t-3xl p-6 pb-8 h-[90%]">
                            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
                            <Text className="text-xl font-bold text-gray-900 mb-6">Update Result</Text>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <FilterDropdown
                                    label="Class"
                                    value={getClassDisplayName(classes.find((c) => c.id === selectedClass))}
                                    options={classes.map((c) => ({ label: getClassDisplayName(c), value: c.id }))}
                                    onSelect={setSelectedClass}
                                />
                                <FilterDropdown
                                    label="Student"
                                    value={students.find(s => s.id === selectedStudent) ? `${students.find(s => s.id === selectedStudent).firstName} ${students.find(s => s.id === selectedStudent).lastName}` : ""}
                                    options={students.map(s => ({ label: `${s.firstName} ${s.lastName}`, value: s.id }))}
                                    onSelect={setSelectedStudent}
                                    placeholder={loading ? "Loading students..." : "Select Student"}
                                />
                                <FilterDropdown
                                    label="Subject"
                                    value={subjects.find(s => s.id === selectedSubject)?.name}
                                    options={subjects.map(s => ({ label: s.name, value: s.id }))}
                                    onSelect={setSelectedSubject}
                                />
                                <FilterDropdown
                                    label="Test / Exam"
                                    value={examOptions.find((exam) => exam.id === selectedExam)?.label || ""}
                                    options={examOptions.map((exam) => ({
                                        label: exam.label,
                                        value: exam.id,
                                    }))}
                                    onSelect={(val: any) => {
                                        setSelectedExam(val);
                                        const picked = examOptions.find((exam) => exam.id === val);
                                        if (picked?.totalMarks) setTotalMark(String(picked.totalMarks));
                                    }}
                                    placeholder={selectedSubject ? "Select Test / Exam" : "Select subject first"}
                                />

                                <View className="mb-4">
                                    <Text className="text-gray-500 text-xs mb-1 font-medium">Obtained mark</Text>
                                    <View className="bg-white border border-gray-200 rounded-lg px-3 py-3">
                                        <TextInput
                                            placeholder="Enter marks"
                                            value={score}
                                            onChangeText={setScore}
                                            keyboardType="numeric"
                                            className="text-gray-900 font-medium"
                                        />
                                    </View>
                                </View>

                                <View className="mb-6">
                                    <Text className="text-gray-500 text-xs mb-1 font-medium">Total mark obtainable</Text>
                                    <View className="bg-white border border-gray-200 rounded-lg px-3 py-3">
                                        <TextInput
                                            placeholder="Enter total marks"
                                            value={totalMark}
                                            onChangeText={setTotalMark}
                                            keyboardType="numeric"
                                            className="text-gray-900 font-medium"
                                        />
                                    </View>
                                </View>

                                <Text className="text-orange-500 font-bold mb-3">Upload Bulk Results</Text>
                                <View className="flex-row gap-4 mb-8">
                                    <TouchableOpacity 
                                        onPress={handleDownloadTemplate}
                                        className="flex-1 bg-orange-50 py-3 rounded-lg flex-row items-center justify-center border border-orange-100"
                                    >
                                        <Text className="text-orange-500 font-medium mr-2">Download template</Text>
                                        <Feather name="download" size={16} color="orange" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={handleUploadBulk}
                                        className="flex-1 bg-orange-50 py-3 rounded-lg flex-row items-center justify-center border border-orange-100"
                                    >
                                        <Text className="text-orange-500 font-medium mr-2">Upload template</Text>
                                        <Feather name="upload" size={16} color="orange" />
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <PrimaryButton
                                text={submitting ? (initialData ? "Updating..." : "Submitting...") : (initialData ? "Update Result" : "Submit")}
                                onPress={handleSubmit}
                                disabled={submitting}
                                className="mt-2"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const StudentMarkModal = ({ visible, onClose, result, onEdit }: { visible: boolean, onClose: () => void, result: StudentResult | null, onEdit: (res: StudentResult) => void }) => {
    if (!result) return null;
    const percentage = (result.obtainedMark / result.totalMark) * 100;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/40 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-t-3xl p-6 pb-10">
                            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

                            <Text className="text-base font-bold text-gray-900 mb-6">Student Mark</Text>

                            <View className="flex-row justify-between items-center mb-8">
                                <View className="flex-row items-center">
                                    <CustomAvatar
                                        name={`${result.student.firstName} ${result.student.lastName}`}
                                        size={50}
                                    />
                                    <View className="ml-3">
                                        <Text className="font-bold text-lg text-gray-900">{result.student.firstName} {result.student.lastName}</Text>
                                        <Text className="text-gray-400 text-xs">{result.subject.name}</Text>
                                    </View>
                                </View>
                                <Text className="font-bold text-gray-900">{result.class.name}</Text>
                            </View>

                            <View className="flex-row justify-between mb-8">
                                <View>
                                    <Text className="text-gray-500 text-xs mb-1">Total mark</Text>
                                    <Text className="font-bold text-xl text-gray-900">{result.totalMark}</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500 text-xs mb-1">Obtained mark</Text>
                                    <Text className="font-bold text-xl text-gray-900">{result.obtainedMark}</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500 text-xs mb-1">Percentage</Text>
                                    <Text className="font-bold text-xl text-gray-900">{percentage.toFixed(0)}%</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500 text-xs mb-1">Grade</Text>
                                    <Text className="font-bold text-xl text-gray-900">{result.grade || 'N/A'}</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-4">
                                <TouchableOpacity 
                                    onPress={() => onEdit(result)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl items-center"
                                >
                                    <Text className="text-gray-900 font-bold">Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-orange-500 py-3 rounded-xl items-center">
                                    <Text className="text-white font-bold">Download</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

// --- Main Screen ---
const ManageResultScreen = ({ navigation, route }: StackNavigationProps) => {
    const [filters, setFilters] = useState<any>({ classId: null, examId: null, subjectId: null });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const { activeTermId } = combineStore();
    const [selectedResult, setSelectedResult] = useState<StudentResult | null>(null);
    const [editResult, setEditResult] = useState<StudentResult | null>(null);
    
    const [results, setResults] = useState<StudentResult[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [terms, setTerms] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const activeFilterCount = [filters.classId, filters.examId, filters.subjectId].filter(Boolean).length;

    const ITEMS_PER_PAGE = 20;

    const fetchInitialData = async () => {
        // Sequential loading — classes load first so the filter sheet
        // can populate before subjects/sessions arrive.
        try {
            const classesRes = await GetClasses();
            if (classesRes.responseStatus === 200) setClasses(asArray(classesRes.responseData));

            const subjectsRes = await GetSubjects();
            if (subjectsRes.responseStatus === 200) setSubjects(asArray(subjectsRes.responseData));

            const examsRes = await GetExams();
            if (examsRes.responseStatus === 200) setExams(asArray(examsRes.responseData));

            const sessionsRes = await GetSessions();
            if (sessionsRes.responseStatus === 200) {
                const sessions = asArray(sessionsRes.responseData);
                const currentSession = sessions.find((s: any) => s.isCurrent) || sessions[0];
                if (currentSession) {
                    const termsRes = await GetTerms(currentSession.id);
                    if (termsRes.responseStatus === 200) setTerms(asArray(termsRes.responseData));
                }
            }
        } catch (error) {
            console.error("fetchInitialData error:", error);
        }
    };

    const fetchResultsData = async () => {
        setLoading(true);
        try {
            const query: any = {};
            if (filters.classId) query.classId = filters.classId;
            if (filters.examId) query.examId = filters.examId;
            if (filters.subjectId) query.subjectId = filters.subjectId;
            if (activeTermId) query.termId = activeTermId;

            const { responseData, responseStatus } = await GetResults(query);
            if (responseStatus === 200) {
                setResults(asArray(responseData));
            }
        } catch (error) {
            console.error("fetchResultsData error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
        
        // Auto-open create modal if studentId is passed
        if (route?.params?.studentId) {
            setCreateModalVisible(true);
        }
    }, [route?.params?.studentId]);

    useEffect(() => {
        fetchResultsData();
    }, [filters, activeTermId]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchResultsData();
    };

    // Filter Logic (Search)
    const filteredResults = useMemo(() => {
        return (results || []).filter(r => {
            const name = `${r?.student?.firstName || ""} ${r?.student?.lastName || ""}`.toLowerCase();
            return name.includes((searchQuery || "").toLowerCase());
        });
    }, [searchQuery, results]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleViewResult = (result: StudentResult) => {
        setSelectedResult(result);
        setViewModalVisible(true);
    };

    const handleEditResult = (result: StudentResult) => {
        setEditResult(result);
        setViewModalVisible(false);
        setCreateModalVisible(true);
    };

    return (
        <ScreenContainer>
            <View className="flex-row items-center justify-between px-4 mb-6">
                <View className="flex-row items-center flex-1">
                    <BackBtn />
                    <Text className="text-xl font-bold text-gray-900 ml-4">Results</Text>
                </View>
                <TouchableOpacity
                    className="w-10 h-10 border border-gray-200 rounded-lg items-center justify-center bg-white relative"
                    onPress={() => setFiltersOpen(true)}
                    accessibilityLabel="Filter results"
                >
                    <Ionicons name="options-outline" size={20} color="#374151" />
                    {activeFilterCount > 0 ? (
                        <View className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-orange-500 items-center justify-center px-1">
                            <Text className="text-[9px] text-white font-bold">{activeFilterCount}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>

            <View className="flex-1 px-4">

                {/* Search + Action */}
                <View className="flex-row items-center mb-4 gap-2">
                    <View className="flex-1 bg-white border border-gray-200 rounded-lg flex-row items-center px-3 h-11">
                        <Ionicons name="search" size={18} color="gray" />
                        <TextInput
                            placeholder="Search for student"
                            className="flex-1 ml-2 text-gray-900"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <PrimaryButton
                        text="Update Result"
                        onPress={() => setCreateModalVisible(true)}
                        className="h-11 px-4 py-0"
                    />
                </View>

                {/* Header Row */}
                <View className="flex-row justify-between px-2 mb-2 bg-gray-50 py-2 rounded-t-lg">
                    <Text className="text-xs font-bold text-gray-500 flex-[1.4]">Student</Text>
                    <Text className="text-xs font-bold text-gray-500 flex-1 text-center">Obtained Mark</Text>
                    <Text className="text-xs font-bold text-gray-500 flex-1 text-right pr-2">Total Mark</Text>
                </View>

                {/* List */}
                {loading && !refreshing ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#F97316" size="large" />
                    </View>
                ) : (
                    <ScrollView 
                        className="flex-1" 
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F97316"]} />
                        }
                    >
                        {paginatedResults.length === 0 ? (
                            <NoDataComponent />
                        ) : (
                            paginatedResults.map((result: any, idx: number) => {
                                const s = result?.student || {};
                                const name = [s.firstName, s.lastName].filter(Boolean).join(' ') || 'Student';
                                // A result may come back without an obtained mark when the row
                                // was pre-created but never scored. Show a dash for both mark
                                // cells in that case, and treat the grade as unavailable so we
                                // don't display a grade against an empty mark.
                                const rawObtained = result?.obtainedMark ?? result?.total ?? result?.score;
                                const hasMark = rawObtained !== null && rawObtained !== undefined && String(rawObtained) !== "";
                                const obtainedDisplay = hasMark ? rawObtained : "—";
                                const totalDisplay = result?.totalMark ?? result?.exam?.totalMarks ?? "—";
                                const gradeDisplay = hasMark ? (result?.grade || "View") : "—";
                                return (
                                <TouchableOpacity
                                    key={result?.id ?? idx}
                                    className="flex-row items-center py-3 border-b border-gray-50"
                                    onPress={() => handleViewResult(result)}
                                >
                                    <View className="flex-row items-center flex-[1.4]">
                                        <CustomAvatar name={name} size={40} />
                                        <View className="ml-3 flex-1">
                                            <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                                                {name}
                                            </Text>
                                            {s.registrationNumber ? (
                                              <Text className="text-gray-400 text-[10px]">ID: {s.registrationNumber}</Text>
                                            ) : null}
                                        </View>
                                    </View>

                                    <View className="flex-1 items-center">
                                        <Text className="font-medium text-gray-700">{obtainedDisplay}</Text>
                                    </View>

                                    <View className="flex-1 items-end pr-2">
                                        <Text className="font-medium text-gray-700">{totalDisplay}</Text>
                                        {hasMark && result?.grade ? (
                                            <Text className="text-[10px] text-orange-500 font-bold mt-0.5">{result.grade}</Text>
                                        ) : null}
                                    </View>
                                </TouchableOpacity>
                                );
                            })
                        )}
                        <View className="h-8" />
                    </ScrollView>
                )}

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </View>

            <UpdateResultModal 
                visible={createModalVisible} 
                onClose={() => {
                    setCreateModalVisible(false);
                    setEditResult(null);
                }} 
                classes={classes}
                subjects={subjects}
                terms={terms}
                onRefresh={fetchResultsData}
                initialData={editResult}
                preSelectedStudentId={route?.params?.studentId}
            />
            <StudentMarkModal
                visible={viewModalVisible}
                onClose={() => setViewModalVisible(false)}
                result={selectedResult}
                onEdit={handleEditResult}
            />

            {/* Filter bottom sheet (drag to close) */}
            <DraggableBottomSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)}>
                <View className="pb-2">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-gray-900">Filter Results</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setFilters({ classId: null, examId: null, subjectId: null });
                            }}
                        >
                            <Text className="text-sm text-orange-500 font-semibold">Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <FilterDropdown
                        label="Class"
                        value={getClassDisplayName(classes.find((c) => c.id === filters.classId))}
                        options={classes.map((c) => ({ label: getClassDisplayName(c), value: c.id }))}
                        onSelect={(val) => setFilters({ ...filters, classId: val })}
                    />
                    <FilterDropdown
                        label="Test / Exam"
                        value={getUniqueExamOptions(exams, filters.classId, filters.subjectId).find((exam) => exam.id === filters.examId)?.label || ""}
                        options={getUniqueExamOptions(exams, filters.classId, filters.subjectId).map((exam) => ({ label: exam.label, value: exam.id }))}
                        onSelect={(val) => setFilters({ ...filters, examId: val })}
                    />
                    <FilterDropdown
                        label="Subject"
                        value={subjects.find((s) => s.id === filters.subjectId)?.name || ""}
                        options={subjects.map((s) => ({ label: s.name, value: s.id }))}
                        onSelect={(val) => setFilters({ ...filters, subjectId: val })}
                    />

                    <TouchableOpacity
                        onPress={() => setFiltersOpen(false)}
                        className="bg-orange-500 rounded-xl py-3 items-center mt-4"
                    >
                        <Text className="text-white font-semibold">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </DraggableBottomSheet>
        </ScreenContainer>
    );
};

export default ManageResultScreen;
