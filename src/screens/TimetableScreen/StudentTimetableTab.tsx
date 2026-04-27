import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    Pressable,
    TextInput,
    RefreshControl,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import DaySelector from '@/src/components/UI/DaySelector';
import { GetClasses, GetClassSubjects } from '@/src/services/class';
import {
    CreateTimetableSchedule,
    DeleteTimetableSchedule,
    GetClassTimetable,
    GetTimetableSettings,
    UpdateTimetableSchedule
} from '@/src/services/timetable';
import { GetSubjects } from '@/src/services/courses';
import { GetStaff } from '@/src/services/teacher';
import { combineStore } from '@/src/store';
import { showToast } from '@/src/components/UI/showToast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const StudentTimetableTab = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [settings, setSettings] = useState<any>(null);
    const [timetableData, setTimetableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    // Map of classId -> { subjectId: { staffId, staffName } } so the edit
    // modal can pick the single teacher assigned to the class-subject pair
    // rather than letting the user choose from every staff member.
    const [classSubjectMap, setClassSubjectMap] = useState<Record<string, Record<string, { staffId: number | null; staffName: string }>>>({});
    const [form, setForm] = useState({
        classId: '',
        subjectId: '',
        staffId: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
    });

    const { user } = combineStore();
    const account = user?.accounts?.[0] as any;
    const canManage = account?.type === "SCHOOL";

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, settingsRes, subjectsRes, teachersRes] = await Promise.all([
                GetClasses(),
                GetTimetableSettings(),
                GetSubjects(),
                GetStaff(),
            ]);

            if (classesRes.responseStatus === 200) {
                const classRows = Array.isArray(classesRes.responseData?.data)
                    ? classesRes.responseData.data
                    : Array.isArray(classesRes.responseData)
                        ? classesRes.responseData
                        : [];
                const classOptions = classRows.map((c: any) => {
                    const pieces = [c?.name, c?.section?.name, c?.faculty?.name].filter(Boolean);
                    return {
                        label: pieces.join(" • ") || c?.name || "Class",
                        value: c.id.toString(),
                    };
                });
                setClasses(classOptions);
                if (classOptions.length > 0) {
                    setSelectedClass(classOptions[0].value);
                }
            }

            if (settingsRes.responseStatus === 200) {
                setSettings(settingsRes.responseData);
            }

            if (subjectsRes.responseStatus === 200) {
                const subjectRows = Array.isArray(subjectsRes.responseData?.data)
                    ? subjectsRes.responseData.data
                    : Array.isArray(subjectsRes.responseData)
                        ? subjectsRes.responseData
                        : [];
                setSubjects(subjectRows.map((s: any) => ({
                    label: s.name,
                    value: s.id.toString(),
                })));
            }

            if (teachersRes.responseStatus === 200) {
                const teacherRows = Array.isArray(teachersRes.responseData?.data)
                    ? teachersRes.responseData.data
                    : Array.isArray(teachersRes.responseData)
                        ? teachersRes.responseData
                        : [];
                setTeachers(teacherRows.map((t: any) => ({
                    label: `${t.firstName || ''} ${t.lastName || ''}`.trim(),
                    value: t.id.toString(),
                })));
            }
        } catch (error) {
            console.error('Error fetching timetable background data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchTimetable = useCallback(async () => {
        if (!selectedClass) return;
        try {
            const res = await GetClassTimetable(parseInt(selectedClass));
            if (res.responseStatus === 200) {
                const rows = Array.isArray(res.responseData?.data)
                    ? res.responseData.data
                    : Array.isArray(res.responseData)
                        ? res.responseData
                        : [];
                setTimetableData(rows);
            }
        } catch (error) {
            console.error('Error fetching class timetable:', error);
        }
    }, [selectedClass]);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    // Fetch the class-subject mapping whenever the selected class OR the
    // class being edited in the modal changes. Keeps the mapping in sync
    // with /class-subject, which is the single source of truth configured
    // from the admin board.
    const loadClassSubjects = useCallback(async (classId: number | string | null | undefined) => {
        if (!classId) return;
        try {
            const { responseData, responseStatus } = await GetClassSubjects(classId);
            if (responseStatus !== 200) return;
            const rows = Array.isArray(responseData?.data)
                ? responseData.data
                : Array.isArray(responseData) ? responseData : [];
            const subjectToStaff: Record<string, { staffId: number | null; staffName: string }> = {};
            rows.forEach((cs: any) => {
                const staffName = [cs?.staff?.firstName, cs?.staff?.lastName].filter(Boolean).join(" ");
                subjectToStaff[String(cs.subjectId)] = {
                    staffId: cs.staffId ?? null,
                    staffName: staffName || "",
                };
            });
            setClassSubjectMap((prev) => ({ ...prev, [String(classId)]: subjectToStaff }));
        } catch (error) {
            console.error("loadClassSubjects error:", error);
        }
    }, []);

    useEffect(() => {
        if (selectedClass) loadClassSubjects(selectedClass);
    }, [selectedClass, loadClassSubjects]);

    // Also refresh the mapping when the modal opens for a different class,
    // or when the user changes the class dropdown inside the modal.
    useEffect(() => {
        if (modalVisible && form.classId && !classSubjectMap[String(form.classId)]) {
            loadClassSubjects(form.classId);
        }
    }, [modalVisible, form.classId, classSubjectMap, loadClassSubjects]);

    // Teacher dropdown options: only the staff assigned to the selected
    // class+subject pair. Empty when no subject is picked yet or when the
    // pair has no teacher configured on the admin board.
    const teacherOptions = useMemo(() => {
        const classKey = form.classId || selectedClass;
        const subjectKey = form.subjectId;
        if (!classKey || !subjectKey) return [];
        const entry = classSubjectMap[String(classKey)]?.[String(subjectKey)];
        if (entry && entry.staffId != null && entry.staffName) {
            return [{ label: entry.staffName, value: String(entry.staffId) }];
        }
        return [];
    }, [form.classId, form.subjectId, selectedClass, classSubjectMap]);

    // Auto-pick / clear the assigned teacher whenever the class or subject
    // changes. Keeps the form in sync with the current mapping and avoids
    // leaking a stale teacher from a previous subject selection.
    useEffect(() => {
        const classKey = form.classId || selectedClass;
        if (!classKey || !form.subjectId) {
            setForm((prev) => (prev.staffId ? { ...prev, staffId: "" } : prev));
            return;
        }
        const entry = classSubjectMap[String(classKey)]?.[String(form.subjectId)];
        const next = entry?.staffId != null ? String(entry.staffId) : "";
        setForm((prev) => (prev.staffId === next ? prev : { ...prev, staffId: next }));
    }, [form.subjectId, form.classId, selectedClass, classSubjectMap]);

    const timeSlots = settings?.timeSlots || [];

    const getScheduleForSlot = (slotTime: string) => {
        return timetableData.find(item =>
            item.day === selectedDay &&
            String(item.startTime || '').toLowerCase().replace(/\s/g, '') === slotTime.toLowerCase().replace(/\s/g, '')
        );
    };

    const openCreateModal = (slot: any) => {
        setEditingSchedule(null);
        setForm({
            classId: selectedClass,
            subjectId: '',
            staffId: '',
            day: selectedDay,
            startTime: slot.time || '',
            endTime: slot.endTime || '',
        });
        setModalVisible(true);
    };

    const openEditModal = (schedule: any) => {
        setEditingSchedule(schedule);
        setForm({
            classId: schedule.classId?.toString() || selectedClass,
            subjectId: schedule.subjectId?.toString() || '',
            staffId: schedule.staffId?.toString() || '',
            day: schedule.day || selectedDay,
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
        });
        setModalVisible(true);
    };

    const handleDeleteSchedule = async (schedule: any) => {
        try {
            const { responseStatus } = await DeleteTimetableSchedule(schedule.id);
            if (responseStatus === 200) {
                showToast("Schedule deleted");
                fetchTimetable();
            }
        } catch (error) {
            console.error('handleDeleteSchedule error:', error);
            showToast("Unable to delete schedule");
        }
    };

    const handleSaveSchedule = async () => {
        if (!form.classId || !form.subjectId || !form.day || !form.startTime || !form.endTime) {
            showToast("Fill all required schedule fields");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                classId: Number(form.classId),
                subjectId: Number(form.subjectId),
                staffId: form.staffId ? Number(form.staffId) : undefined,
                day: form.day,
                startTime: form.startTime,
                endTime: form.endTime,
            };

            const res = editingSchedule
                ? await UpdateTimetableSchedule(editingSchedule.id, payload)
                : await CreateTimetableSchedule(payload);

            if (res.responseStatus === 200 || res.responseStatus === 201) {
                showToast(editingSchedule ? "Schedule updated" : "Schedule created");
                setModalVisible(false);
                fetchTimetable();
            } else {
                showToast(res.responseData?.message || "Unable to save schedule");
            }
        } catch (error) {
            console.error('handleSaveSchedule error:', error);
            showToast("Unable to save schedule");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#F97316" />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} tintColor="#F97316" colors={["#F97316"]} />}
        >
            <View className="mb-2 px-4 pt-4">
                <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Select Class</Text>
                <Dropdown
                    style={{
                        height: 45,
                        borderColor: '#E5E7EB',
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        backgroundColor: 'white'
                    }}
                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                    data={classes}
                    labelField="label"
                    valueField="value"
                    placeholder="Select class"
                    value={selectedClass}
                    onChange={item => setSelectedClass(item.value)}
                    renderRightIcon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
                />
            </View>

            <View className="px-4">
                <DaySelector
                    days={DAYS}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                />
            </View>

            <View className="px-4 pb-5 mt-2">
                {timeSlots.length > 0 ? (
                    timeSlots.map((slot: any, index: number) => {
                        const schedule = !slot.isBreak ? getScheduleForSlot(slot.time) : null;
                        const colors = ['#E0F2FE', '#F0FDF4', '#FEFCE8', '#FFF1F2', '#F3E8FF'];
                        const bgColor = schedule ? colors[schedule.id % colors.length] : '#F3F4F6';

                        if (slot.isBreak) {
                            return (
                                <View key={index} className="flex-row mb-3 items-center">
                                    <View className="w-16 mr-2 pt-1">
                                        <Text className="text-xs font-bold text-gray-500 text-right">{slot.time}</Text>
                                        <Text className="text-[10px] text-gray-400 text-right">{slot.endTime}</Text>
                                    </View>
                                    <View className="flex-1 bg-orange-50 rounded-lg p-3 border-l-4 border-orange-300">
                                        <View className="flex-row items-center justify-center gap-2">
                                            <Ionicons name="cafe-outline" size={16} color="#C2410C" />
                                            <Text className="text-sm font-bold text-orange-800 italic">{slot.name || 'Break'}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        }

                        return (
                            <View key={index} className="flex-row mb-3">
                                <View className="w-16 mr-2 pt-2">
                                    <Text className="text-xs font-bold text-gray-500 text-right">{slot.time}</Text>
                                    <Text className="text-[10px] text-gray-400 text-right">{slot.endTime}</Text>
                                </View>
                                <View className="flex-1">
                                    {schedule ? (
                                        <View
                                            className="rounded-xl p-3 border border-gray-100"
                                            style={{ backgroundColor: bgColor }}
                                        >
                                            <View className="flex-row items-start justify-between">
                                                <View className="flex-1 mr-2">
                                                    <Text className="text-base font-bold text-gray-900 mb-1">{schedule.subject?.name}</Text>
                                                    <View className="flex-row items-center gap-1">
                                                        <Ionicons name="person-outline" size={12} color="#4B5563" />
                                                        <Text className="text-xs text-gray-600">
                                                            {schedule.staff ? `${schedule.staff.firstName} ${schedule.staff.lastName}` : 'No teacher assigned'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {canManage && (
                                                    <View className="flex-row gap-3">
                                                        <TouchableOpacity onPress={() => openEditModal(schedule)}>
                                                            <Ionicons name="create-outline" size={16} color="#F97316" />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDeleteSchedule(schedule)}>
                                                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            disabled={!canManage}
                                            onPress={() => openCreateModal(slot)}
                                            className="rounded-xl p-3 border-2 border-dashed border-gray-200 bg-gray-50 justify-center h-16"
                                        >
                                            <Text className="text-xs text-gray-400 text-center italic">Free Period</Text>
                                            {canManage && (
                                                <Text className="text-[11px] text-orange-500 text-center mt-1">Tap to add schedule</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View className="items-center justify-center py-10">
                        <Ionicons name="time-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 mt-2 text-center">No time slots defined in settings</Text>
                    </View>
                )}
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setModalVisible(false)}>
                    <Pressable className="bg-white rounded-t-3xl p-5" onPress={(e) => e.stopPropagation()}>
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            {editingSchedule ? "Edit Schedule" : "Add Schedule"}
                        </Text>

                        <View className="mb-3">
                            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Class</Text>
                            <Dropdown
                                style={{ height: 44, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                data={classes}
                                labelField="label"
                                valueField="value"
                                value={form.classId}
                                onChange={(item) => setForm((prev) => ({ ...prev, classId: item.value }))}
                            />
                        </View>

                        <View className="mb-3">
                            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</Text>
                            <Dropdown
                                style={{ height: 44, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                data={subjects}
                                labelField="label"
                                valueField="value"
                                value={form.subjectId}
                                onChange={(item) => setForm((prev) => ({ ...prev, subjectId: item.value }))}
                            />
                        </View>

                        <View className="mb-3">
                            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Teacher</Text>
                            <Dropdown
                                style={{ height: 44, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                data={teacherOptions}
                                labelField="label"
                                valueField="value"
                                placeholder={form.subjectId ? "Assigned teacher" : "Select subject first"}
                                placeholderStyle={{ color: '#9CA3AF' }}
                                disable={!form.subjectId}
                                value={form.staffId}
                                onChange={(item) => setForm((prev) => ({ ...prev, staffId: item.value }))}
                            />
                            {form.subjectId && teacherOptions.length === 0 ? (
                                <Text className="text-[11px] text-red-500 mt-1">
                                    No teacher assigned to this subject for the class.
                                </Text>
                            ) : null}
                        </View>

                        <View className="mb-3">
                            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Day</Text>
                            <Dropdown
                                style={{ height: 44, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                data={DAYS.map((d) => ({ label: d, value: d }))}
                                labelField="label"
                                valueField="value"
                                value={form.day}
                                onChange={(item) => setForm((prev) => ({ ...prev, day: item.value }))}
                            />
                        </View>

                        <TextInput
                            value={form.startTime}
                            onChangeText={(startTime) => setForm((prev) => ({ ...prev, startTime }))}
                            placeholder="Start time (e.g. 08:00 AM)"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-3"
                        />

                        <TextInput
                            value={form.endTime}
                            onChangeText={(endTime) => setForm((prev) => ({ ...prev, endTime }))}
                            placeholder="End time (e.g. 09:00 AM)"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-4"
                        />

                        <TouchableOpacity
                            onPress={handleSaveSchedule}
                            disabled={saving}
                            className="bg-orange-500 rounded-lg py-3 items-center"
                        >
                            <Text className="text-white font-semibold">
                                {saving ? "Saving..." : editingSchedule ? "Update Schedule" : "Create Schedule"}
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </ScrollView>
    );
};

export default StudentTimetableTab;
