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
import { CreateQuestion } from '@/src/services/exam';
import { showToast } from '@/src/components/UI/showToast';

interface AddQuestionModalProps {
    onSubmit: () => void;
}

const AddQuestionModal = forwardRef((props: AddQuestionModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    // Context State
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // Question State
    const [questionText, setQuestionText] = useState('');
    const [topic, setTopic] = useState('');
    const [options, setOptions] = useState([{ id: 1, text: '' }, { id: 2, text: '' }]);
    const [correctOptionId, setCorrectOptionId] = useState<string>('');

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
        setSelectedClass('');
        setSelectedSubject('');
        setQuestionText('');
        setTopic('');
        setOptions([{ id: 1, text: '' }, { id: 2, text: '' }]);
        setCorrectOptionId('');
    };

    const handleClose = () => {
        setVisible(false);
        resetForm();
    };

    const handleAddOption = () => {
        if (options.length >= 5) {
            Alert.alert('Limit Reached', 'You can verify max 5 options.');
            return;
        }
        const newId = options.length > 0 ? Math.max(...options.map(o => o.id)) + 1 : 1;
        setOptions([...options, { id: newId, text: '' }]);
    };

    const handleRemoveOption = (id: number) => {
        if (options.length <= 2) {
            Alert.alert('Error', 'A question must have at least 2 options.');
            return;
        }
        setOptions(options.filter(o => o.id !== id));
        if (correctOptionId === id.toString()) {
            setCorrectOptionId('');
        }
    };

    const handleUpdateOption = (id: number, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const handleSubmit = async () => {
        if (!selectedClass || !selectedSubject) {
            Alert.alert('Missing Info', 'Please select a class and subject.');
            return;
        }
        if (!questionText.trim()) {
            Alert.alert('Missing Info', 'Please enter the question text.');
            return;
        }
        if (!correctOptionId) {
            Alert.alert('Missing Info', 'Please select the correct answer.');
            return;
        }
        if (options.some(o => !o.text.trim())) {
            Alert.alert('Missing Info', 'Please fill in all options.');
            return;
        }

        const correctAnswerText = options.find(o => o.id.toString() === correctOptionId)?.text;

        setLoading(true);
        try {
            const res = await CreateQuestion({
                classId: parseInt(selectedClass),
                subjectId: parseInt(selectedSubject),
                questionText,
                topic,
                options: options.map(o => o.text),
                correctAnswer: correctAnswerText
            });

            if (res.responseStatus === 201 || res.responseStatus === 200) {
                showToast('Question added successfully');
                props.onSubmit();
                handleClose();
            } else {
                Alert.alert('Error', res.responseData.message || 'Failed to add question');
            }
        } catch (error) {
            console.error('Create question error:', error);
            Alert.alert('Error', 'An error occurred while saving the question.');
        } finally {
            setLoading(false);
        }
    };

    const answerOptions = options
        .filter(o => o.text.trim().length > 0)
        .map(o => ({ label: `Option ${o.id}: ${o.text.substring(0, 20)}${o.text.length > 20 ? '...' : ''}`, value: o.id.toString() }));

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
                        <Text className="text-xl font-bold text-gray-900">Add Question</Text>
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

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Question *</Text>
                                <TextInput
                                    value={questionText}
                                    onChangeText={setQuestionText}
                                    placeholder="Type question here..."
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base min-h-[80px]"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Topic</Text>
                                <TextInput
                                    value={topic}
                                    onChangeText={setTopic}
                                    placeholder="e.g. Geometry"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="mb-4">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-sm font-medium text-gray-700">Options *</Text>
                                    <TouchableOpacity onPress={handleAddOption}>
                                        <Text className="text-orange-500 text-sm font-semibold">+ Add Option</Text>
                                    </TouchableOpacity>
                                </View>

                                {options.map((option, index) => (
                                    <View key={option.id} className="flex-row items-center mb-2 gap-2">
                                        <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                                            <Text className="text-gray-500 font-bold">{String.fromCharCode(65 + index)}</Text>
                                        </View>
                                        <TextInput
                                            value={option.text}
                                            onChangeText={(text) => handleUpdateOption(option.id, text)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-base"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                        {options.length > 2 && (
                                            <TouchableOpacity onPress={() => handleRemoveOption(option.id)}>
                                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>

                            <View className="mb-8">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Correct Answer *</Text>
                                <Dropdown
                                    style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    data={answerOptions}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select correct option"
                                    value={correctOptionId}
                                    onChange={item => setCorrectOptionId(item.value)}
                                    renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
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
                                    <Text className="text-white font-bold text-base">Save Question</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default AddQuestionModal;
