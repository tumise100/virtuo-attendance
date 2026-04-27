import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StatusBar, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import InputWithFilter from "@/src/components/UI/InputWithFilter";
import MessageCard from "@/src/components/UI/MessageCard";
import { ModalProp, StackNavigationProps } from "@/src/shared";
import { Ionicons } from "@expo/vector-icons";
import NewMessageModal from "@/src/components/UI/NewMessageModal";
import FilterMessageModal from "@/src/components/UI/FilterMessageModal";
import EditMessageModal from "@/src/components/UI/EditMessageModal";
import DeleteMessageConfirmModal from "@/src/components/UI/DeleteMessageConfirmModal";
import {
    CreateNotification,
    DeleteNotification,
    GetNotifications,
    UpdateNotification,
} from "@/src/services/communication";
import { GetMyStudents } from "@/src/services/student";
import { GetStaff } from "@/src/services/teacher";
import { GetClasses } from "@/src/services/class";
import moment from "moment";
import { showToast } from "@/src/components/UI/showToast";

const MessagesScreen = ({}: StackNavigationProps) => {
    // Refs for Modals
    const newMessageRef = useRef<ModalProp>(null);
    const filterMessageRef = useRef<ModalProp>(null);
    const editMessageRef = useRef<ModalProp>(null);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // State for Data & Selection
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [studentOptions, setStudentOptions] = useState<{ label: string; value: string }[]>([]);
    const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);
    const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        fetchMessages();
        fetchReceiverOptions();
    }, []);

    const filteredMessages = useMemo(() => (messages || []).filter(msg =>
        (msg?.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (msg?.message || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    ), [messages, searchTerm]);

    const normalizeItems = (input: any): any[] => {
        if (Array.isArray(input)) return input;
        if (Array.isArray(input?.data)) return input.data;
        return [];
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { responseData, responseStatus } = await GetNotifications(false);
            if (responseStatus === 200) {
                const list = normalizeItems(responseData).map((item: any) => ({
                    id: item.id,
                    title: item.title || "Untitled",
                    message: item.message || "",
                    receivers: Array.isArray(item.receivers) ? item.receivers : [],
                    date: item.createdAt || item.date || new Date().toISOString(),
                }));
                setMessages(list);
            }
        } catch (error) {
            console.error("fetchMessages error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReceiverOptions = async () => {
        try {
            const [studentsRes, staffRes, classesRes] = await Promise.all([
                GetMyStudents({ limit: 200 }),
                GetStaff({ limit: 200 }),
                GetClasses({ limit: 200 }),
            ]);

            const students = normalizeItems(studentsRes.responseData).map((student: any) => ({
                label: `${student.firstName || ""} ${student.lastName || ""}${student.class?.name ? ` - ${student.class.name}` : ""}`.trim(),
                value: `STUDENT_${student.id}`,
            }));

            const staffs = normalizeItems(staffRes.responseData).map((staff: any) => ({
                label: `${staff.firstName || ""} ${staff.lastName || ""}`.trim(),
                value: `STAFF_${staff.id}`,
            }));

            const classes = normalizeItems(classesRes.responseData).map((klass: any) => ({
                label: `${klass.name}`,
                value: `CLASS_${klass.id}`,
            }));

            setStudentOptions(students);
            setStaffOptions(staffs);
            setClassOptions(classes);
        } catch (error) {
            console.error("fetchReceiverOptions error:", error);
        }
    };

    const handleEdit = (item: any) => {
        setSelectedMessage(item);
        editMessageRef.current?.setVisible(true);
    };

    const handleDelete = (item: any) => {
        setSelectedMessage(item);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedMessage?.id) return;
        setSaving(true);
        DeleteNotification(selectedMessage.id)
            .then(({ responseStatus }) => {
                if (responseStatus === 200 || responseStatus === 204) {
                    setMessages((prev) => prev.filter((item) => item.id !== selectedMessage.id));
                    showToast("Notification deleted");
                }
            })
            .catch((error) => {
                console.error("handleConfirmDelete error:", error);
                showToast("Unable to delete notification");
            })
            .finally(() => {
                setSaving(false);
                setShowDeleteConfirm(false);
                setSelectedMessage(null);
            });
    };

    const handleCreateMessage = async (payload: { title: string; message: string; receivers: string[] }) => {
        setSaving(true);
        try {
            const { responseStatus } = await CreateNotification(payload);
            if (responseStatus === 201 || responseStatus === 200) {
                showToast("Notification sent");
                fetchMessages();
            }
        } catch (error) {
            console.error("handleCreateMessage error:", error);
            showToast("Unable to send notification");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateMessage = async (payload: { id: number | string; title: string; message: string; receivers: string[] }) => {
        setSaving(true);
        try {
            const { responseStatus } = await UpdateNotification(payload.id, payload);
            if (responseStatus === 200) {
                showToast("Notification updated");
                fetchMessages();
            }
        } catch (error) {
            console.error("handleUpdateMessage error:", error);
            showToast("Unable to update notification");
        } finally {
            setSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-white px-4 pt-14">
            <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} animated />

            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <BackBtn />
                    <SubheadingSemibold18 text="Messages" customClassName="ml-5 text-gray-900" />
                </View>
                {/* New Message Button */}
                <TouchableOpacity
                    className="p-2 bg-orange-50 rounded-lg"
                    onPress={() => newMessageRef.current?.setVisible(true)}
                >
                    <Ionicons name="add" size={24} color="#F97316" />
                </TouchableOpacity>
            </View>

            {/* Search and Filter */}
            <InputWithFilter
                filterModalRef={filterMessageRef}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeHolder="Search messages..."
            />

            {/* Messages List */}
            <FlatList
                data={filteredMessages}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMessages} tintColor="#F97316" colors={["#F97316"]} />}
                renderItem={({ item }) => (
                    <MessageCard
                        title={item.title}
                        message={item.message}
                        date={moment(item.date).format("DD/MM/YYYY")}
                        receivers={item.receivers}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                    />
                )}
                ListFooterComponent={() => <View className="h-20" />}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center py-20">
                        <Ionicons name="mail-unread-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400 mt-2">
                            {loading ? "Loading..." : "No messages found"}
                        </Text>
                    </View>
                )}
            />

            {/* Modals */}
            <NewMessageModal
                ref={newMessageRef}
                onSubmit={handleCreateMessage}
                loading={saving}
                studentOptions={studentOptions}
                staffOptions={staffOptions}
                classOptions={classOptions}
            />

            <FilterMessageModal ref={filterMessageRef} />

            <EditMessageModal
                ref={editMessageRef}
                messageData={selectedMessage}
                onSubmit={handleUpdateMessage}
                loading={saving}
                studentOptions={studentOptions}
                staffOptions={staffOptions}
                classOptions={classOptions}
            />

            <DeleteMessageConfirmModal
                visible={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
            />
        </View>
    );
};

export default MessagesScreen;
