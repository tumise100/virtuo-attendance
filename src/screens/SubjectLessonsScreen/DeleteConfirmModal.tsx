import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useDragToClose } from "@/src/components/UI/useDragToClose";
import { View, Text, TouchableOpacity, Modal, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DeleteConfirmModalProps {
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
}

const DeleteConfirmModal = forwardRef((props: DeleteConfirmModalProps, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    const handleClose = () => {
        setVisible(false);
    };

    const handleConfirm = () => {
        props.onConfirm();
        handleClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1 bg-black/50 justify-end"
            >
                <Pressable className="flex-1" onPress={handleClose} />
                <View className="bg-white rounded-t-3xl w-full pb-10 pt-4">
                    {/* Handle bar */}
                    <View className="items-center mb-6">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <View className="items-center px-6">
                        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="trash-outline" size={32} color="#EF4444" />
                        </View>

                        <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                            {props.title}
                        </Text>

                        <Text className="text-base text-gray-500 text-center">
                            {props.message}
                        </Text>

                        {props.itemName && (
                            <Text className="text-base font-semibold text-gray-700 text-center mt-2">
                                "{props.itemName}"
                            </Text>
                        )}
                    </View>

                    <View className="flex-row gap-3 mt-8 px-6">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="flex-1 py-4 bg-gray-100 rounded-xl"
                        >
                            <Text className="text-gray-700 font-bold text-base text-center">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            className="flex-1 py-4 bg-red-500 rounded-xl"
                        >
                            <Text className="text-white font-bold text-base text-center">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default DeleteConfirmModal;
