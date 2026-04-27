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
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

interface EditTopicModalProps {
    onSubmit: (topic: any) => void;
}

const CLASSES = [
    { label: 'JSS 1A', value: '1' },
    { label: 'JSS 2B', value: '2' },
    { label: 'SSS 1 Science', value: '3' },
    { label: 'SSS 2 Science', value: '4' },
];

const SUBJECTS = [
    { label: 'Mathematics', value: '1' },
    { label: 'English Language', value: '2' },
    { label: 'Physics', value: '3' },
    { label: 'Biology', value: '4' },
];

const EditTopicModal = forwardRef((props: EditTopicModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [originalTopic, setOriginalTopic] = useState<any>(null);

    const [title, setTitle] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useImperativeHandle(ref, () => ({
        open: (topic: any) => {
            setOriginalTopic(topic);
            setTitle(topic.title);

            // Find class value from label
            const classItem = CLASSES.find(c => c.label === topic.className);
            setSelectedClass(classItem?.value || '');

            // Find subject value from label
            const subjectItem = SUBJECTS.find(s => s.label === topic.subject);
            setSelectedSubject(subjectItem?.value || '');

            setVisible(true);
        },
        close: () => handleClose()
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    const handleClose = () => {
        setVisible(false);
        setOriginalTopic(null);
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a topic title');
            return;
        }
        if (!selectedClass) {
            Alert.alert('Error', 'Please select a class');
            return;
        }
        if (!selectedSubject) {
            Alert.alert('Error', 'Please select a subject');
            return;
        }

        props.onSubmit({
            id: originalTopic?.id,
            title,
            classId: selectedClass,
            subjectId: selectedSubject,
        });

        handleClose();
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
                <View className="bg-white rounded-t-3xl max-h-[70%] w-full">
                    {/* Handle bar */}
                    <View {...dragHandlers} className="items-center pt-4 pb-2">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    {/* Header */}
                    <View className="flex-row justify-between items-center px-6 py-2 border-b border-gray-100">
                        <Text className="text-xl font-bold text-gray-900">Edit Topic</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close-circle-outline" size={28} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Title */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Topic Title *</Text>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Enter topic title"
                                className="border border-gray-200 rounded-lg px-3 py-3 text-base"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        {/* Class */}
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Class *</Text>
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
                                data={CLASSES}
                                labelField="label"
                                valueField="value"
                                placeholder="Select class"
                                value={selectedClass}
                                onChange={item => setSelectedClass(item.value)}
                                renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                            />
                        </View>

                        {/* Subject */}
                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Subject *</Text>
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
                                data={SUBJECTS}
                                labelField="label"
                                valueField="value"
                                placeholder="Select subject"
                                value={selectedSubject}
                                onChange={item => setSelectedSubject(item.value)}
                                renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-orange-500 rounded-xl py-4 items-center mb-6"
                        >
                            <Text className="text-white font-bold text-base">Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default EditTopicModal;
