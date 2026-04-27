import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS } from '@/src/theme/colors';

interface DeleteMessageConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteMessageConfirmModal = ({ visible, onClose, onConfirm }: DeleteMessageConfirmModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/50 justify-center items-center px-4" onPress={onClose}>
                <Pressable className="bg-white rounded-xl p-6 w-full max-w-sm" onPress={(e) => e.stopPropagation()}>
                    <Text className="text-lg font-bold text-gray-900 mb-2">Delete Notification?</Text>
                    <Text className="text-sm text-gray-500 mb-6">
                        This action cannot be undone. Are you sure you want to delete this notification?
                    </Text>

                    <View className="flex-row justify-end gap-3">
                        <Button
                            mode="outlined"
                            onPress={onClose}
                            style={{ borderRadius: 8, borderColor: '#D1D5DB' }}
                            textColor="gray"
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={onConfirm}
                            style={{ borderRadius: 8 }}
                            buttonColor="#EF4444"
                            textColor='white'
                        >
                            Delete
                        </Button>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default DeleteMessageConfirmModal;
