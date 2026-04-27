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
import { UpdateLesson } from '@/src/services/lesson';
import { showToast } from '@/src/components/UI/showToast';

interface EditLessonModalProps {
    onSubmit: () => void;
}

const EditLessonModal = forwardRef((props: EditLessonModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [originalLesson, setOriginalLesson] = useState<any>(null);

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    useImperativeHandle(ref, () => ({
        open: async (lesson: any) => {
            setOriginalLesson(lesson);
            setTitle(lesson.title);
            setContent(lesson.content || '');
            
            // We need to fetch data first to map labels to values if values aren't provided
            await fetchInitialData();
            
            // Try to set selected class and subject
            // If the lesson object has classId/subjectId, use them. Otherwise find by label.
            if (lesson.classId) {
                setSelectedClass(lesson.classId.toString());
            } else if (lesson.className) {
                // Find class value from label
                setClasses(currentClasses => {
                    const classItem = currentClasses.find(c => c.label === lesson.className);
                    if (classItem) setSelectedClass(classItem.value);
                    return currentClasses;
                });
            }

            if (lesson.subjectId) {
                setSelectedSubject(lesson.subjectId.toString());
            } else if (lesson.subject) {
                setSubjects(currentSubjects => {
                    const subjectItem = currentSubjects.find(s => s.label === lesson.subject);
                    if (subjectItem) setSelectedSubject(subjectItem.value);
                    return currentSubjects;
                });
            }

            setVisible(true);
        },
        close: () => handleClose()
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    const fetchInitialData = async () => {
        setFetchingData(true);
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                GetClasses(),
                GetSubjects()
            ]);
            
            let fetchedClasses: any[] = [];
            let fetchedSubjects: any[] = [];

            if (classesRes.responseStatus === 200) {
                fetchedClasses = asArray(classesRes.responseData).map((c: any) => ({ label: c.name, value: c.id.toString() }));
                setClasses(fetchedClasses);
            }
            if (subjectsRes.responseStatus === 200) {
                fetchedSubjects = asArray(subjectsRes.responseData).map((s: any) => ({ label: s.name, value: s.id.toString() }));
                setSubjects(fetchedSubjects);
            }

            return { fetchedClasses, fetchedSubjects };
        } catch (error) {
            console.error('Error fetching modal data:', error);
            return { fetchedClasses: [], fetchedSubjects: [] };
        } finally {
            setFetchingData(false);
        }
    };

    const handleClose = () => {
        setVisible(false);
        setOriginalLesson(null);
        setSelectedClass('');
        setSelectedSubject('');
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a lesson title');
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
            const updateData = {
                title,
                content,
                classId: parseInt(selectedClass),
                subjectId: parseInt(selectedSubject),
            };

            const res = await UpdateLesson(originalLesson.id, updateData);

            if (res.responseStatus === 200) {
                showToast('Lesson updated successfully');
                props.onSubmit();
                handleClose();
            } else {
                Alert.alert('Error', res.responseData.message || 'Failed to update lesson');
            }
        } catch (error) {
            console.error('Update lesson error:', error);
            Alert.alert('Error', 'An error occurred while updating the lesson.');
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
                <View className="bg-white rounded-t-3xl max-h-[90%] w-full">
                    <View {...dragHandlers} className="items-center pt-4 pb-2">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <View className="flex-row justify-between items-center px-6 py-2 border-b border-gray-100">
                        <Text className="text-xl font-bold text-gray-900">Edit Lesson</Text>
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
                                <Text className="text-sm font-medium text-gray-700 mb-2">Lesson Title *</Text>
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter lesson title"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="flex-row gap-3 mb-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Class *</Text>
                                    <Dropdown
                                        style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        data={classes}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={selectedClass}
                                        onChange={item => setSelectedClass(item.value)}
                                        renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Subject *</Text>
                                    <Dropdown
                                        style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        data={subjects}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select"
                                        value={selectedSubject}
                                        onChange={item => setSelectedSubject(item.value)}
                                        renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                                    />
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Lesson Content</Text>
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Type your lesson content here..."
                                    multiline
                                    numberOfLines={8}
                                    textAlignVertical="top"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base min-h-[160px]"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                className={`bg-orange-500 rounded-xl py-4 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-base">Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default EditLessonModal;
