import React from 'react';
import { Modal, View, Pressable, KeyboardAvoidingView, Platform, type DimensionValue } from 'react-native';
import { useDragToClose } from '../useDragToClose';

interface BottomModalContainerProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: DimensionValue; // Optional height, defaults to auto
}

const BottomModalContainer = ({ visible, onClose, children, height }: BottomModalContainerProps) => {
    const dragHandlers = useDragToClose(onClose);
    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                >
                    <Pressable
                        className={`bg-white rounded-t-3xl p-6 pb-10 w-full ${typeof height === 'undefined' ? '' : ''}`}
                        style={{ height: height }}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Handle bar — drag down to dismiss */}
                        <View {...dragHandlers} className="items-center mb-6 py-2">
                            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </View>

                        {children}
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

export default BottomModalContainer;
