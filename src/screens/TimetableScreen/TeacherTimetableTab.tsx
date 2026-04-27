import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import DaySelector from '@/src/components/UI/DaySelector';
import { GetStaff } from '@/src/services/teacher';
import { GetTeacherTimetable, GetTimetableSettings } from '@/src/services/timetable';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TeacherTimetableTab = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [settings, setSettings] = useState<any>(null);
    const [timetableData, setTimetableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [staffRes, settingsRes] = await Promise.all([
                GetStaff(),
                GetTimetableSettings()
            ]);

            if (staffRes.responseStatus === 200) {
                const teacherOptions = (staffRes.responseData || []).map((t: any) => ({
                    label: `${t.firstName} ${t.lastName}`,
                    value: t.id.toString()
                }));
                setTeachers(teacherOptions);
                if (teacherOptions.length > 0) {
                    setSelectedTeacher(teacherOptions[0].value);
                }
            }

            if (settingsRes.responseStatus === 200) {
                setSettings(settingsRes.responseData);
            }
        } catch (error) {
            console.error('Error fetching teacher timetable background data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchTimetable = useCallback(async () => {
        if (!selectedTeacher) return;
        try {
            const res = await GetTeacherTimetable(parseInt(selectedTeacher));
            if (res.responseStatus === 200) {
                setTimetableData(res.responseData);
            }
        } catch (error) {
            console.error('Error fetching teacher timetable:', error);
        }
    }, [selectedTeacher]);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    const timeSlots = settings?.timeSlots || [];

    const getScheduleForSlot = (slotTime: string) => {
        return (timetableData || []).find(item =>
            item?.day === selectedDay &&
            String(item?.startTime || '').toLowerCase().replace(/\s/g, '') === String(slotTime || '').toLowerCase().replace(/\s/g, '')
        );
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
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { fetchData(); fetchTimetable(); }} tintColor="#F97316" colors={["#F97316"]} />}
        >
            {/* Teacher Selector */}
            <View className="mb-2 px-4 pt-4">
                <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">Select Teacher</Text>
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
                    data={teachers}
                    labelField="label"
                    valueField="value"
                    placeholder="Select teacher"
                    value={selectedTeacher}
                    onChange={item => setSelectedTeacher(item.value)}
                    renderRightIcon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
                />
            </View>

            {/* Day Selector */}
            <View className="px-4">
                <DaySelector
                    days={DAYS}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                />
            </View>

            {/* Time Slots */}
            <View className="px-4 pb-5 mt-2">
                {timeSlots.length > 0 ? (
                    timeSlots.map((slot: any, index: number) => {
                        const schedule = !slot.isBreak ? getScheduleForSlot(slot.time) : null;
                        const colors = ['#EFF6FF', '#FDF2F8', '#ECFEFF', '#F0FDF4', '#FFFBEB'];
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
                                            <Text className="text-base font-bold text-gray-900 mb-1">{schedule.subject?.name}</Text>
                                            <View className="flex-row items-center gap-1">
                                                <Ionicons name="people-outline" size={12} color="#4B5563" />
                                                <Text className="text-xs text-gray-600">
                                                    Class: {schedule.class?.name || 'Unknown'}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="rounded-xl p-3 border-2 border-dashed border-gray-200 bg-gray-50 justify-center h-16">
                                            <Text className="text-xs text-gray-400 text-center italic">Free Period</Text>
                                        </View>
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
        </ScrollView>
    );
};

export default TeacherTimetableTab;
