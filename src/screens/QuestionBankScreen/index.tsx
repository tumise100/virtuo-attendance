import { asArray } from '@/src/utils';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import AddQuestionModal from './AddQuestionModal';
import EditQuestionModal from './EditQuestionModal';
import DeleteConfirmModal from '../SubjectLessonsScreen/DeleteConfirmModal';
import { ModalProp } from '@/src/shared';
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { GetExamQuestions, DeleteQuestion } from '@/src/services/exam';
import { showToast } from '@/src/components/UI/showToast';

const parseQuestionPayload = (item: any) => {
    const cleanText = (value: any) =>
        String(value || '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n')
            .replace(/[ \t]{2,}/g, ' ')
            .trim();
    try {
        const parsed = typeof item.question === 'string' ? JSON.parse(item.question) : item.question;
        const options = Array.isArray(parsed?.options) ? parsed.options : [];
        const answerOption = options.find((option: any) => `option${option.id}` === item.answer);
        return {
            questionText: cleanText(parsed?.text || item.questionText || item.question || ''),
            className: parsed?.class || item.class?.name || 'All Classes',
            correctAnswer: cleanText(answerOption?.text || item.correctAnswer || item.answer || ''),
        };
    } catch {
        return {
            questionText: cleanText(item.questionText || item.question || ''),
            className: item.class?.name || 'All Classes',
            correctAnswer: cleanText(item.correctAnswer || item.answer || ''),
        };
    }
};

const QuestionCard = ({ item, onDelete, onEdit }: any) => {
    const display = parseQuestionPayload(item);
    return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
            <View className="flex-row gap-2">
                <View className="bg-blue-50 px-2 py-0.5 rounded text-xs flex-row items-center">
                    <Text className="text-blue-600 text-xs font-semibold">{display.className}</Text>
                </View>
                <View className="bg-purple-50 px-2 py-0.5 rounded text-xs flex-row items-center">
                    <Text className="text-purple-600 text-xs font-semibold">{item.subject?.name || 'General'}</Text>
                </View>
            </View>
        </View>

        <Text className="text-gray-900 font-medium text-base mb-3 leading-6">
            {display.questionText}
        </Text>

        <View className="bg-green-50 px-3 py-2 rounded-lg self-start mb-3">
            <Text className="text-green-700 text-sm font-medium">
                Ans: {display.correctAnswer}
            </Text>
        </View>

        <View className="flex-row justify-end border-t border-gray-50 pt-3 gap-4">
            <TouchableOpacity onPress={() => onEdit(item)} className="flex-row items-center">
                <Ionicons name="create-outline" size={16} color="#F97316" />
                <Text className="text-orange-500 text-sm ml-1 font-medium">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item)} className="flex-row items-center">
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text className="text-red-500 text-sm ml-1 font-medium">Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
    );
};

const QuestionBankScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const addQuestionRef = React.useRef<ModalProp>(null);
    const editQuestionRef = React.useRef<any>(null);
    const deleteConfirmRef = React.useRef<ModalProp>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, subjectsRes, questionsRes] = await Promise.all([
                GetClasses(),
                GetSubjects(),
                GetExamQuestions()
            ]);

            if (classesRes.responseStatus === 200) {
                setClasses([{ label: 'All Classes', value: '' }, ...asArray(classesRes.responseData).map((c: any) => ({ label: c.name, value: c.id.toString() }))]);
            }
            if (subjectsRes.responseStatus === 200) {
                setSubjects([{ label: 'All Subjects', value: '' }, ...asArray(subjectsRes.responseData).map((s: any) => ({ label: s.name, value: s.id.toString() }))]);
            }
            if (questionsRes.responseStatus === 200) {
                setQuestions(asArray(questionsRes.responseData));
            }
        } catch (error) {
            console.error('Error fetching question bank data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const filteredQuestions = (questions || []).filter(q => {
        const display = parseQuestionPayload(q);
        const matchesSearch = (display.questionText || "").toLowerCase().includes((searchTerm || "").toLowerCase());
        const matchesClass = !selectedClass || q?.classId?.toString() === selectedClass;
        const matchesSubject = !selectedSubject || q?.subjectId?.toString() === selectedSubject;
        return matchesSearch && matchesClass && matchesSubject;
    });

    const handleDelete = (item: any) => {
        setSelectedQuestion(item);
        deleteConfirmRef.current?.setVisible(true);
    };

    const confirmDelete = async () => {
        if (!selectedQuestion) return;
        try {
            const res = await DeleteQuestion(selectedQuestion.id);
            if (res.responseStatus === 200) {
                showToast('Question deleted successfully');
                setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
            } else {
                showToast('Failed to delete question');
            }
        } catch (error) {
            console.error('Delete question error:', error);
            showToast('An error occurred while deleting');
        } finally {
            deleteConfirmRef.current?.setVisible(false);
        }
    };

    const handleEdit = (item: any) => {
        editQuestionRef.current?.open(item);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-4 pt-12 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <BackBtn />
                        <SubheadingSemibold18 text="Question Bank" customClassName="ml-5 text-gray-900" />
                    </View>
                </View>

                <View className="flex-row gap-2 mb-3">
                    <View className="flex-1">
                        <Dropdown
                            style={{ height: 40, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 }}
                            placeholderStyle={{ color: '#9CA3AF', fontSize: 13 }}
                            selectedTextStyle={{ color: '#111827', fontSize: 13 }}
                            data={classes}
                            labelField="label"
                            valueField="value"
                            placeholder="Class"
                            value={selectedClass}
                            onChange={item => setSelectedClass(item.value)}
                            renderRightIcon={() => <Ionicons name="chevron-down" size={16} color="gray" />}
                        />
                    </View>
                    <View className="flex-1">
                        <Dropdown
                            style={{ height: 40, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10 }}
                            placeholderStyle={{ color: '#9CA3AF', fontSize: 13 }}
                            selectedTextStyle={{ color: '#111827', fontSize: 13 }}
                            data={subjects}
                            labelField="label"
                            valueField="value"
                            placeholder="Subject"
                            value={selectedSubject}
                            onChange={item => setSelectedSubject(item.value)}
                            renderRightIcon={() => <Ionicons name="chevron-down" size={16} color="gray" />}
                        />
                    </View>
                </View>

                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3">
                    <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                    <TextInput
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Search questions..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 py-2.5 ml-2 text-sm"
                    />
                </View>
            </View>

            {loading && !refreshing ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#F97316" />
                </View>
            ) : (
                <FlatList
                    data={filteredQuestions}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
                    }
                    renderItem={({ item }) => (
                        <QuestionCard
                            item={item}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="documents-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-2 text-center">No questions found</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                onPress={() => addQuestionRef.current?.setVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <AddQuestionModal
                ref={addQuestionRef}
                onSubmit={handleRefresh}
            />

            <EditQuestionModal
                ref={editQuestionRef}
                onSubmit={handleRefresh}
            />

            <DeleteConfirmModal
                ref={deleteConfirmRef}
                onConfirm={confirmDelete}
                title="Delete Question"
                message="Are you sure you want to delete this question?"
                itemName={parseQuestionPayload(selectedQuestion || {}).questionText.substring(0, 30)}
            />
        </View>
    );
};

export default QuestionBankScreen;
