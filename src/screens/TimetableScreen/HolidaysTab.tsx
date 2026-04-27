import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import InputWithFilter from '@/src/components/UI/InputWithFilter';
import HolidayCard from '@/src/components/UI/HolidayCard';
import { Ionicons } from '@expo/vector-icons';
import { ModalProp } from '@/src/shared';
import { CreateHoliday, DeleteHoliday, GetHolidays, UpdateHoliday } from '@/src/services/timetable';
import { combineStore } from '@/src/store';
import { showToast } from '@/src/components/UI/showToast';

const HolidaysTab = () => {
    const { user } = combineStore();
    const account = user?.accounts?.[0] as any;
    const canManage = account?.type === "SCHOOL";
    const [searchTerm, setSearchTerm] = useState('');
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });
    const dummyRef = useRef<ModalProp>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await GetHolidays();
            if (res.responseStatus === 200) {
                setHolidays(res.responseData || []);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const openCreateModal = () => {
        setEditingHoliday(null);
        setForm({ name: "", description: "", startDate: "", endDate: "" });
        setModalVisible(true);
    };

    const openEditModal = (holiday: any) => {
        const startDate = holiday.startDate || holiday.date;
        const endDate = holiday.endDate || holiday.date;
        setEditingHoliday(holiday);
        setForm({
            name: holiday.name || "",
            description: holiday.description || "",
            startDate: startDate ? String(startDate).slice(0, 10) : "",
            endDate: endDate ? String(endDate).slice(0, 10) : "",
        });
        setModalVisible(true);
    };

    const handleSaveHoliday = async () => {
        if (!form.name.trim() || !form.startDate) {
            showToast("Holiday name and start date are required");
            return;
        }
        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                startDate: form.startDate,
                endDate: form.endDate || form.startDate,
            };
            const res = editingHoliday
                ? await UpdateHoliday(editingHoliday.id, payload)
                : await CreateHoliday(payload);
            if (res.responseStatus === 200 || res.responseStatus === 201) {
                showToast(editingHoliday ? "Holiday updated" : "Holiday created");
                setModalVisible(false);
                fetchData();
            }
        } catch (error) {
            console.error("handleSaveHoliday error:", error);
            showToast("Unable to save holiday");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteHoliday = async (holiday: any) => {
        try {
            const { responseStatus } = await DeleteHoliday(holiday.id);
            if (responseStatus === 200) {
                showToast("Holiday deleted");
                setHolidays((prev) => prev.filter((item) => item.id !== holiday.id));
            }
        } catch (error) {
            console.error("handleDeleteHoliday error:", error);
            showToast("Unable to delete holiday");
        }
    };

    const filteredHolidays = (holidays || []).filter(h =>
        (h?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    );

    return (
        <View className="flex-1 bg-white px-4 pt-4">
            {/* Search */}
            <View className="mb-4">
                <InputWithFilter
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeHolder="Search holidays..."
                    filterModalRef={dummyRef}
                />
            </View>

            {canManage && (
                <TouchableOpacity
                    onPress={openCreateModal}
                    className="mb-4 bg-orange-500 rounded-lg py-3 px-4 flex-row items-center justify-center"
                >
                    <Ionicons name="add" size={18} color="white" />
                    <Text className="text-white font-semibold ml-2">Add Holiday</Text>
                </TouchableOpacity>
            )}

            {loading && !refreshing ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#F97316" />
                </View>
            ) : (
                <FlatList
                    data={filteredHolidays}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
                    }
                    renderItem={({ item }) => (
                        <View>
                            <HolidayCard holiday={{
                                ...item,
                                startDate: item.startDate || item.date,
                                endDate: item.endDate || item.date
                            }} />
                            {canManage && (
                                <View className="flex-row justify-end gap-4 mb-3">
                                    <TouchableOpacity onPress={() => openEditModal(item)} className="flex-row items-center">
                                        <Ionicons name="create-outline" size={16} color="#F97316" />
                                        <Text className="text-orange-500 text-xs font-semibold ml-1">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteHoliday(item)} className="flex-row items-center">
                                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                                        <Text className="text-red-500 text-xs font-semibold ml-1">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-2">No holidays found</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setModalVisible(false)}>
                    <Pressable className="bg-white rounded-t-3xl p-5" onPress={(e) => e.stopPropagation()}>
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            {editingHoliday ? "Edit Holiday" : "Add Holiday"}
                        </Text>
                        <TextInput
                            value={form.name}
                            onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
                            placeholder="Holiday name"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-3"
                        />
                        <TextInput
                            value={form.description}
                            onChangeText={(description) => setForm((prev) => ({ ...prev, description }))}
                            placeholder="Description"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-3"
                        />
                        <TextInput
                            value={form.startDate}
                            onChangeText={(startDate) => setForm((prev) => ({ ...prev, startDate }))}
                            placeholder="Start Date (YYYY-MM-DD)"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-3"
                        />
                        <TextInput
                            value={form.endDate}
                            onChangeText={(endDate) => setForm((prev) => ({ ...prev, endDate }))}
                            placeholder="End Date (YYYY-MM-DD)"
                            className="border border-gray-200 rounded-lg px-3 py-3 mb-4"
                        />
                        <TouchableOpacity
                            onPress={handleSaveHoliday}
                            disabled={saving}
                            className="bg-orange-500 rounded-lg py-3 items-center"
                        >
                            <Text className="text-white font-semibold">
                                {saving ? "Saving..." : editingHoliday ? "Update Holiday" : "Create Holiday"}
                            </Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

export default HolidaysTab;
