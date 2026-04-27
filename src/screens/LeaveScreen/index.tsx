import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/components/UI/ScreenContainer';
import { GenericDropdown } from '@/src/components/UI/Dropdown';
import CreateLeaveModal from './CreateLeaveModal';
import DeleteConfirmModal from '../SubjectLessonsScreen/DeleteConfirmModal'; // Reuse
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { ModalProp } from '@/src/shared';
import { GetLeaveRequests, GetLeaveBalance, UpdateLeaveStatus, deleteLeaveRequest } from '@/src/services/leave';
import moment from 'moment';
import { combineStore } from '@/src/store';
import { showToast } from '@/src/components/UI/showToast';

const CURRENT_YEAR = new Date().getFullYear();
// Show a window of 5 years back and 1 year ahead so users can file/view
// leave for past or upcoming periods. Updates automatically each calendar year.
const YEARS = Array.from({ length: 7 }, (_, i) => {
    const year = CURRENT_YEAR + 1 - i;
    return { label: String(year), value: String(year) };
});

const MONTHS = [
    { label: 'All Months', value: '' },
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
];

const LeaveCard = ({ item, onDelete, onApprove, onReject, canManage }: any) => {
    let statusColor = "bg-amber-100 text-amber-700";
    if (item.status === 'APPROVED') statusColor = "bg-green-100 text-green-700";
    if (item.status === 'REJECTED') statusColor = "bg-red-100 text-red-700";

    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="text-gray-900 font-bold text-base">
                        {moment(startDate).format('DD MMM, YYYY')} - {moment(endDate).format('DD MMM, YYYY')}
                    </Text>
                    <Text className="text-gray-500 text-sm font-medium mt-1">
                        {days} Day{days > 1 ? 's' : ''}
                    </Text>
                </View>
                <View className={`px-2.5 py-1 rounded-full ${statusColor.split(' ')[0]}`}>
                    <Text className={`text-xs font-bold ${statusColor.split(' ')[1]}`}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <Text className="text-gray-600 text-sm mb-3 ml-0.5 leading-5" numberOfLines={2}>
                {item.reason}
            </Text>

            <View className="flex-row justify-between items-center border-t border-gray-50 pt-3">
                {item.attachment ? (
                    <TouchableOpacity className="flex-row items-center">
                        <Ionicons name="document-attach-outline" size={16} color="#F97316" />
                        <Text className="text-orange-500 text-xs ml-1 font-medium">View Document</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center">
                        <Text className="text-gray-300 text-xs ml-1">No Document</Text>
                    </View>
                )}

                {item.status === 'PENDING' && canManage && (
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity onPress={() => onApprove(item)} className="flex-row items-center">
                            <Ionicons name="checkmark-circle-outline" size={16} color="#16A34A" />
                            <Text className="text-green-600 text-xs ml-1 font-medium">Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onReject(item)} className="flex-row items-center">
                            <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
                            <Text className="text-red-600 text-xs ml-1 font-medium">Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {item.status === 'PENDING' && !canManage && (
                    <TouchableOpacity onPress={() => onDelete(item)} className="flex-row items-center">
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text className="text-red-500 text-xs ml-1 font-medium">Delete Request</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const LeaveScreen = () => {
    const { user } = combineStore();
    const account = user?.accounts?.[0] as any;
    const canManage = account?.type === "SCHOOL";
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [leaves, setLeaves] = useState<any[]>([]);
    const [balance, setBalance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    // Admin (SCHOOL) users see Staff Leave + Leave Report tabs, mirroring
    // the web /school/manage-leave page. Staff users see their own leave
    // applications only, matching the /lecturer/manage-leave page.
    const [activeTab, setActiveTab] = useState<'staff-leave' | 'report'>('staff-leave');

    // Modal Ref
    const createLeaveRef = React.useRef<ModalProp>(null);
    const deleteConfirmRef = React.useRef<ModalProp>(null);

    const [selectedLeave, setSelectedLeave] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [leavesRes, balanceRes] = await Promise.all([
                GetLeaveRequests({
                    year: selectedYear,
                    month: selectedMonth,
                    search: searchTerm
                }),
                GetLeaveBalance()
            ]);
            
            if (leavesRes.responseStatus === 200) {
                setLeaves(leavesRes.responseData || []);
            }
            if (balanceRes.responseStatus === 200) {
                setBalance(balanceRes.responseData);
            }
        } catch (error) {
            console.error('Error fetching leave data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedYear, selectedMonth, searchTerm]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleCreateLeaveSuccess = () => {
        fetchData();
    };

    const handleDelete = (item: any) => {
        setSelectedLeave(item);
        deleteConfirmRef.current?.setVisible(true);
    };

    const onConfirmDelete = async () => {
        if (!selectedLeave) return;
        try {
            await deleteLeaveRequest(selectedLeave.id);
            showToast("Leave request deleted");
            fetchData();
        } catch (error) {
            console.error('Error deleting leave:', error);
            showToast("Unable to delete leave request");
        }
    };

    const handleUpdateStatus = async (item: any, status: "APPROVED" | "REJECTED") => {
        try {
            const { responseStatus } = await UpdateLeaveStatus(item.id, status);
            if (responseStatus === 200) {
                showToast(`Leave ${status.toLowerCase()}`);
                fetchData();
            }
        } catch (error) {
            console.error('Error updating leave status:', error);
            showToast("Unable to update leave status");
        }
    };

    return (
        <ScreenContainer>
            {/* Header */}
            <View className="px-4 mb-4">
                <View className="flex-row items-center">
                    <BackBtn />
                    <Text className="text-2xl font-bold text-gray-900 ml-4">
                        {canManage
                            ? (activeTab === 'staff-leave' ? 'Staff Leave' : 'Leave Report')
                            : 'Leave Application'}
                    </Text>
                </View>
            </View>

            {canManage ? (
                <View className="flex-row border-b border-gray-100 mx-4 mb-4">
                    <TouchableOpacity
                        onPress={() => setActiveTab('staff-leave')}
                        className={`flex-1 items-center py-3 border-b-2 ${activeTab === 'staff-leave' ? 'border-orange-500' : 'border-transparent'}`}
                    >
                        <Text className={`font-semibold ${activeTab === 'staff-leave' ? 'text-orange-500' : 'text-gray-500'}`}>Staff Leave</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('report')}
                        className={`flex-1 items-center py-3 border-b-2 ${activeTab === 'report' ? 'border-orange-500' : 'border-transparent'}`}
                    >
                        <Text className={`font-semibold ${activeTab === 'report' ? 'text-orange-500' : 'text-gray-500'}`}>Leave Report</Text>
                    </TouchableOpacity>
                </View>
            ) : null}

            <View className="flex-1 px-4">
                {/* Balance Card — staff only; for admin we show aggregate counts */}
                {!canManage ? (
                    <View className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4 flex-row items-center justify-between">
                        <View>
                            <Text className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Leave Balance</Text>
                            <View className="flex-row items-baseline">
                                <Text className="text-2xl font-bold text-orange-600">
                                    {balance?.remaining ?? '--'}
                                </Text>
                                <Text className="text-orange-400 text-xs font-medium ml-1">
                                    / {balance?.allocated ?? '--'} Days
                                </Text>
                            </View>
                        </View>
                        <View className="bg-white p-2 rounded-full">
                            <Ionicons name="calendar-outline" size={24} color="#F97316" />
                        </View>
                    </View>
                ) : (
                    (() => {
                        const list = Array.isArray(leaves) ? leaves : [];
                        const pending = list.filter((l: any) => l?.status === 'PENDING').length;
                        const approved = list.filter((l: any) => l?.status === 'APPROVED').length;
                        const rejected = list.filter((l: any) => l?.status === 'REJECTED').length;
                        return (
                            <View className="flex-row mb-4">
                                <View className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-3 mr-2">
                                    <Text className="text-[10px] text-amber-700 uppercase tracking-wider">Pending</Text>
                                    <Text className="text-xl font-bold text-amber-700 mt-1">{pending}</Text>
                                </View>
                                <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-3 mx-1">
                                    <Text className="text-[10px] text-green-700 uppercase tracking-wider">Approved</Text>
                                    <Text className="text-xl font-bold text-green-700 mt-1">{approved}</Text>
                                </View>
                                <View className="flex-1 bg-red-50 border border-red-100 rounded-2xl p-3 ml-2">
                                    <Text className="text-[10px] text-red-700 uppercase tracking-wider">Rejected</Text>
                                    <Text className="text-xl font-bold text-red-700 mt-1">{rejected}</Text>
                                </View>
                            </View>
                        );
                    })()
                )}

                {/* Filters */}
                <View className="flex-row gap-2 mb-3">
                    <View className="flex-1">
                        <GenericDropdown
                            data={YEARS}
                            labelField="label"
                            valueField="value"
                            placeholder="Year"
                            value={selectedYear}
                            onChange={item => setSelectedYear(item.value)}
                        />
                    </View>
                    <View className="flex-1">
                        <GenericDropdown
                            data={MONTHS}
                            labelField="label"
                            valueField="value"
                            placeholder="Month"
                            value={selectedMonth}
                            onChange={item => setSelectedMonth(item.value)}
                        />
                    </View>
                </View>

                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 mb-4">
                    <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Search leave records..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 py-2.5 ml-2 text-sm"
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* List */}
                {loading && !refreshing ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#F97316" />
                    </View>
                ) : canManage && activeTab === 'report' ? (
                    (() => {
                        // Per-staff roll-up of approved leave days, matches the admin
                        // web /school/manage-leave "Leave Report" tab.
                        const list = Array.isArray(leaves) ? leaves : [];
                        const byStaff = new Map<number, { staff: any; approvedDays: number; requests: number; pending: number }>();
                        list.forEach((l: any) => {
                            const staffId = l?.staff?.id ?? l?.staffId;
                            if (!staffId) return;
                            const cur = byStaff.get(staffId) || { staff: l.staff, approvedDays: 0, requests: 0, pending: 0 };
                            cur.requests += 1;
                            if (l.status === 'PENDING') cur.pending += 1;
                            if (l.status === 'APPROVED') {
                                const start = new Date(l.startDate).getTime();
                                const end = new Date(l.endDate).getTime();
                                const days = Number.isFinite(start) && Number.isFinite(end)
                                    ? Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
                                    : 0;
                                cur.approvedDays += days;
                            }
                            byStaff.set(staffId, cur);
                        });
                        const rows = Array.from(byStaff.values()).sort((a, b) => b.approvedDays - a.approvedDays);
                        return (
                            <FlatList
                                data={rows}
                                keyExtractor={(r, i) => `${r.staff?.id ?? i}`}
                                contentContainerStyle={{ paddingBottom: 80 }}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />}
                                renderItem={({ item }) => {
                                    const name = [item.staff?.firstName, item.staff?.lastName].filter(Boolean).join(' ') || 'Staff';
                                    return (
                                        <View className="bg-white border border-gray-100 rounded-xl p-4 mb-3 flex-row items-center justify-between">
                                            <View className="flex-1 pr-3">
                                                <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>{name}</Text>
                                                <Text className="text-[11px] text-gray-500 mt-0.5">{item.staff?.designation || 'Staff'}</Text>
                                            </View>
                                            <View className="items-end">
                                                <Text className="text-base font-bold text-orange-600">{item.approvedDays} day{item.approvedDays === 1 ? '' : 's'}</Text>
                                                <Text className="text-[10px] text-gray-400">{item.requests} request{item.requests === 1 ? '' : 's'} • {item.pending} pending</Text>
                                            </View>
                                        </View>
                                    );
                                }}
                                ListEmptyComponent={() => (
                                    <View className="items-center justify-center py-20">
                                        <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                                        <Text className="text-gray-400 mt-2 text-center">No leave data to report yet</Text>
                                    </View>
                                )}
                            />
                        );
                    })()
                ) : (
                    <FlatList
                        data={leaves}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
                        }
                        renderItem={({ item }) => (
                            <LeaveCard
                                item={item}
                                onDelete={handleDelete}
                                onApprove={(leave: any) => handleUpdateStatus(leave, "APPROVED")}
                                onReject={(leave: any) => handleUpdateStatus(leave, "REJECTED")}
                                canManage={canManage}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center py-20">
                                <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 mt-2 text-center">No leave records found</Text>
                            </View>
                        )}
                    />
                )}

                {/* FAB */}
                {!canManage && (
                    <TouchableOpacity
                        className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg shadow-orange-300"
                        onPress={() => createLeaveRef.current?.setVisible(true)}
                    >
                        <Ionicons name="add" size={30} color="white" />
                    </TouchableOpacity>
                )}

                {/* Modals */}
                <CreateLeaveModal
                    ref={createLeaveRef}
                    onSuccess={handleCreateLeaveSuccess}
                />

                <DeleteConfirmModal
                    ref={deleteConfirmRef}
                    onConfirm={onConfirmDelete}
                    title="Delete Request"
                    message="Are you sure you want to delete this leave request?"
                    itemName={selectedLeave?.reason}
                />
            </View>
        </ScreenContainer >
    );
};

export default LeaveScreen;
