import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useDragToClose } from "@/src/components/UI/useDragToClose";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import * as DocumentPicker from 'expo-document-picker';
import { CreateLeaveRequest } from '@/src/services/leave';

interface CreateLeaveModalProps {
    onSuccess: () => void;
}

const DAYS_OPTIONS = Array.from({ length: 14 }, (_, i) => ({
    label: `${i + 1} Day${i > 0 ? 's' : ''}`,
    value: (i + 1).toString()
}));

const CreateLeaveModal = forwardRef((props: CreateLeaveModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [days, setDays] = useState('1');
    const [startDate, setStartDate] = useState(''); // Text input for MVP simplicity "YYYY-MM-DD"
    const [reason, setReason] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    // Calculated End Date
    const endDate = React.useMemo(() => {
        if (!startDate || startDate.length !== 10) return '';
        const d = new Date(startDate);
        if (isNaN(d.getTime())) return '';

        d.setDate(d.getDate() + (parseInt(days) - 1));
        return d.toISOString().split('T')[0];
    }, [startDate, days]);

    const resetForm = () => {
        setDays('1');
        setStartDate('');
        setReason('');
        setSelectedFile(null);
    };

    const handleClose = () => {
        if (loading) return;
        setVisible(false);
        resetForm();
    };

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
            });
            if (!result.canceled) {
                setSelectedFile(result.assets[0]);
            }
        } catch (err) {
            console.log('Document picker error', err);
        }
    };

    const handleSubmit = async () => {
        if (!startDate) {
            Alert.alert('Error', 'Please enter a start date.');
            return;
        }
        if (!endDate) {
            Alert.alert('Error', 'Invalid start date format (YYYY-MM-DD).');
            return;
        }
        if (!reason.trim()) {
            Alert.alert('Error', 'Please enter a reason.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('reason', reason);
            
            if (selectedFile) {
                // @ts-ignore
                formData.append('attachments', {
                    uri: selectedFile.uri,
                    name: selectedFile.name,
                    type: selectedFile.mimeType || 'application/octet-stream',
                });
            }

            const response = await CreateLeaveRequest(formData);
            
            if (response.responseStatus === 201 || response.responseStatus === 200) {
                Alert.alert('Success', 'Leave request submitted successfully.');
                props.onSuccess();
                handleClose();
            } else {
                Alert.alert('Error', response.responseData?.message || 'Failed to submit leave request.');
            }
        } catch (error) {
            console.error('Error submitting leave:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1 bg-black/50 justify-end"
            >
                <Pressable className="flex-1" onPress={handleClose} />
                <View className="bg-white rounded-t-3xl max-h-[85%] w-full">
                    {/* Handle bar */}
                    <View {...dragHandlers} className="items-center pt-4 pb-2">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 py-2 border-b border-gray-100">
                        <Text className="text-xl font-bold text-gray-900">Request Leave</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close-circle-outline" size={28} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false}>
                        {/* Days */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Number of Days *</Text>
                            <Dropdown
                                style={{
                                    height: 48,
                                    borderColor: '#E5E7EB',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                }}
                                placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                data={DAYS_OPTIONS}
                                labelField="label"
                                valueField="value"
                                placeholder="Select days"
                                value={days}
                                onChange={item => setDays(item.value)}
                                renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                            />
                        </View>

                        {/* Dates */}
                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Start Date *</Text>
                                <TextInput
                                    value={startDate}
                                    onChangeText={setStartDate}
                                    placeholder="YYYY-MM-DD"
                                    maxLength={10}
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <View className="flex-1 opacity-50">
                                <Text className="text-sm font-medium text-gray-700 mb-2">End Date</Text>
                                <TextInput
                                    value={endDate}
                                    editable={false}
                                    placeholder="Calculated"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base bg-gray-50 text-gray-500"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Reason */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Reason for Leave *</Text>
                            <TextInput
                                value={reason}
                                onChangeText={setReason}
                                placeholder="Briefly explain your reason..."
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                className="border border-gray-200 rounded-lg px-3 py-3 text-base min-h-[100px]"
                                placeholderTextColor="#9CA3AF"
                                editable={!loading}
                            />
                        </View>

                        {/* Attachment */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</Text>
                            <TouchableOpacity
                                onPress={handlePickDocument}
                                disabled={loading}
                                className="border border-dashed border-gray-300 rounded-lg p-4 items-center flex-row justify-center gap-2 bg-gray-50"
                            >
                                <Ionicons name="cloud-upload-outline" size={20} color="#6B7280" />
                                <Text className="text-gray-600 font-medium">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Upload Document"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading}
                            className="bg-orange-500 rounded-xl py-4 items-center mb-6"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-base">Submit Request</Text>
                            )}
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default CreateLeaveModal;
