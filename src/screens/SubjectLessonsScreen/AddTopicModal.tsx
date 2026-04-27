import { asArray } from '@/src/utils';
import { useDragToClose } from "@/src/components/UI/useDragToClose";
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
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
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { CreateTopic } from '@/src/services/topic';
import { showToast } from '@/src/components/UI/showToast';

interface AddTopicModalProps {
    onSubmit: () => void;
}

const AddTopicModal = forwardRef((props: AddTopicModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [title, setTitle] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    useEffect(() => {
        if (visible) {
            fetchInitialData();
        }
    }, [visible]);

    const fetchInitialData = async () => {
        setFetchingData(true);
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                GetClasses(),
                GetSubjects()
            ]);
            if (classesRes.responseStatus === 200) {
                setClasses(asArray(classesRes.responseData).map((c: any) => ({ label: c.name, value: c.id.toString() })));
            }
            if (subjectsRes.responseStatus === 200) {
                setSubjects(asArray(subjectsRes.responseData).map((s: any) => ({ label: s.name, value: s.id.toString() })));
            }
        } catch (error) {
            console.error('Error fetching modal data:', error);
        } finally {
            setFetchingData(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setSelectedClass('');
        setSelectedSubject('');
    };

    const handleClose = () => {
        setVisible(false);
        resetForm();
    };

    const handleSubmit = async () => {
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

        setLoading(true);
        try {
            const res = await CreateTopic({
                title,
                classId: parseInt(selectedClass),
                subjectId: parseInt(selectedSubject),
            });

            if (res.responseStatus === 201 || res.responseStatus === 200) {
                showToast('Topic created successfully');
                props.onSubmit();
                handleClose();
            } else {
                Alert.alert('Error', res.responseData.message || 'Failed to create topic');
            }
        } catch (error) {
            console.error('Create topic error:', error);
            Alert.alert('Error', 'An error occurred while saving the topic.');
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
                <View className="bg-white rounded-t-3xl max-h-[70%] w-full">
                    <View {...dragHandlers} className="items-center pt-4 pb-2">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <View className="flex-row justify-between items-center px-6 py-2 border-b border-gray-100">
                        <Text className="text-xl font-bold text-gray-900">Create Topic</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close-circle-outline" size={28} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {fetchingData ? (
                        <View className="py-20">
                            <ActivityIndicator size="large" color="#F97316" />
                        </View>
                    ) : (
                        <ScrollView className="px-6 pt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
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

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Class *</Text>
                                <Dropdown
                                    style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    data={classes}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select class"
                                    value={selectedClass}
                                    onChange={item => setSelectedClass(item.value)}
                                    renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Subject *</Text>
                                <Dropdown
                                    style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    data={subjects}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select subject"
                                    value={selectedSubject}
                                    onChange={item => setSelectedSubject(item.value)}
                                    renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                                />
                            </View>

                            <View className="bg-blue-50 rounded-lg p-4 mt-2 mb-6">
                                <View className="flex-row items-start">
                                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                                    <Text className="text-sm text-blue-700 ml-2 flex-1">
                                        Topics help organize your lessons by subject area. You can create lessons under each topic.
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                className={`bg-orange-500 rounded-xl py-4 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-base">Create Topic</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default AddTopicModal;
