import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '@/src/theme/colors';
import { MultiSelect } from 'react-native-element-dropdown';
import CustomPaperTextInput from '@/src/components/UI/Inputs/CustomPaperTextInput';
import { Button } from 'react-native-paper';
import { AntDesign, Feather } from '@expo/vector-icons';

const ROLE_OPTIONS = [
    { label: "Students", value: "STUDENTS" },
    { label: "Staff", value: "STAFF" },
    { label: "Guardian", value: "GUARDIAN" },
];

interface EditMessageModalProps {
    messageData: any;
    onSubmit?: (payload: { id: number | string; title: string; message: string; receivers: string[] }) => void;
    loading?: boolean;
    studentOptions?: { label: string; value: string }[];
    staffOptions?: { label: string; value: string }[];
    classOptions?: { label: string; value: string }[];
}

const EditMessageModal = forwardRef((props: EditMessageModalProps, ref) => {
    const {
        messageData,
        onSubmit,
        loading = false,
        studentOptions = [],
        staffOptions = [],
        classOptions = [],
    } = props;
    const [visible, setVisible] = useState(false);
    const [roles, setRoles] = useState<string[]>([]);
    const [receivers, setReceivers] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const closeModal = () => setVisible(false);

    useEffect(() => {
        if (visible && messageData) {
            setTitle(messageData.title || "");
            setMessage(messageData.message || "");
            const nextReceivers = Array.isArray(messageData.receivers) ? messageData.receivers : [];
            const nextRoles: string[] = [];
            if (nextReceivers.some((r: string) => r === "ALL_STUDENTS" || r.startsWith("STUDENT_") || r.startsWith("CLASS_"))) {
                nextRoles.push("STUDENTS");
            }
            if (nextReceivers.some((r: string) => r === "ALL_STAFF" || r.startsWith("STAFF_"))) {
                nextRoles.push("STAFF");
            }
            if (nextReceivers.some((r: string) => r === "ALL_GUARDIAN")) {
                nextRoles.push("GUARDIAN");
            }
            setRoles(nextRoles);
            setReceivers(nextReceivers);
        }
    }, [visible, messageData]);

    const receiverOptions = useMemo(() => {
        let options: { label: string; value: string }[] = [];

        if (roles.includes("STUDENTS") || roles.length === 0) {
            options.push({ label: "All Students", value: "ALL_STUDENTS" });
            options = [...options, ...classOptions, ...studentOptions];
        }
        if (roles.includes("STAFF") || roles.length === 0) {
            options.push({ label: "All Staff", value: "ALL_STAFF" });
            options = [...options, ...staffOptions];
        }
        if (roles.includes("GUARDIAN") || roles.length === 0) {
            options.push({ label: "All Guardians", value: "ALL_GUARDIAN" });
        }
        return options;
    }, [roles, classOptions, studentOptions, staffOptions]);

    const handleUpdate = () => {
        if (!messageData?.id || !title.trim() || !message.trim() || receivers.length === 0) return;
        onSubmit?.({
            id: messageData.id,
            title: title.trim(),
            message: message.trim(),
            receivers,
        });
        closeModal();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-black/50 justify-end"
            >
                <Pressable className="flex-1" onPress={closeModal} />
                <View className="bg-white rounded-t-3xl max-h-[90%] w-full">
                    {/* Handle bar */}
                    <View className="items-center pt-4 pb-2">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <View className="flex-row justify-between items-center px-6 py-2 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-900">Edit Notification</Text>
                        <TouchableOpacity onPress={closeModal} className="p-1">
                            <AntDesign name="close" size={24} color={COLORS.textColor} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-6 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Role</Text>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                search
                                data={ROLE_OPTIONS}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Role"
                                searchPlaceholder="Search..."
                                value={roles}
                                onChange={item => setRoles(item)}
                                selectedStyle={styles.selectedStyle}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Receiver</Text>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                search
                                data={receiverOptions}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Receiver"
                                searchPlaceholder="Search..."
                                value={receivers}
                                onChange={item => setReceivers(item)}
                                selectedStyle={styles.selectedStyle}
                            />
                        </View>

                        <CustomPaperTextInput
                            label="Title"
                            placeholder="Enter title"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Message</Text>
                            <TextInput
                                style={styles.messageInput}
                                multiline
                                placeholder="Enter message..."
                                value={message}
                                onChangeText={setMessage}
                                textAlignVertical="top"
                            />
                        </View>

                        <CustomPaperTextInput
                            label="Attachments"
                            placeholder="No files attached"
                            value=""
                        />

                        <View className="flex-row gap-3">
                            <Button
                                mode="outlined"
                                onPress={closeModal}
                                style={styles.buttonOutlined}
                                textColor="gray"
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleUpdate}
                                style={styles.buttonContained}
                                buttonColor={COLORS.primary[500]}
                                disabled={!title.trim() || !message.trim() || receivers.length === 0 || loading}
                                loading={loading}
                                labelStyle={{ color: 'white' }}
                            >
                                Update & Resend
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

const styles = {
    dropdown: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
    selectedStyle: {
        borderRadius: 12,
        backgroundColor: COLORS.primary[100],
    },
    messageInput: {
        height: 120,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'white',
        fontSize: 14,
    },
    buttonOutlined: {
        flex: 1,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center' as 'center',
        borderColor: '#D1D5DB',
    },
    buttonContained: {
        flex: 2,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center' as 'center',
    },
};

export default EditMessageModal;
