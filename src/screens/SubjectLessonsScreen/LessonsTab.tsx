import { asArray } from '@/src/utils';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import AddLessonModal from './AddLessonModal';
import EditLessonModal from './EditLessonModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ModalProp } from '@/src/shared';
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { GetLessons, DeleteLesson } from '@/src/services/lesson';
import { GenerateQuestionsFromLesson } from '@/src/services/exam';
import { showToast } from '@/src/components/UI/showToast';

const LessonCard = ({
    lesson,
    onEdit,
    onDelete,
    onGenerateQuestions,
    isGeneratingQuestions,
}: {
    lesson: any;
    onEdit: () => void;
    onDelete: () => void;
    onGenerateQuestions: () => void;
    isGeneratingQuestions: boolean;
}) => (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row items-start justify-between mb-2">
            <Text className="text-base font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                {lesson.title}
            </Text>
            <View className="flex-row gap-2">
                <TouchableOpacity onPress={onEdit} className="p-1">
                    <Ionicons name="create-outline" size={18} color="#F97316" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} className="p-1">
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>

        <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {lesson.content}
        </Text>

        <View className="flex-row flex-wrap gap-2 mb-2">
            <View className="bg-blue-50 px-2.5 py-1 rounded-full flex-row items-center">
                <Ionicons name="school-outline" size={12} color="#3B82F6" />
                <Text className="text-xs font-medium text-blue-600 ml-1">{lesson.class?.name || 'N/A'}</Text>
            </View>
            <View className="bg-purple-50 px-2.5 py-1 rounded-full flex-row items-center">
                <Ionicons name="book-outline" size={12} color="#8B5CF6" />
                <Text className="text-xs font-medium text-purple-600 ml-1">{lesson.subject?.name || 'N/A'}</Text>
            </View>
            <View className="bg-gray-50 px-2.5 py-1 rounded-full flex-row items-center">
                <Ionicons name="document-outline" size={12} color="#6B7280" />
                <Text className="text-xs font-medium text-gray-600 ml-1">{lesson.files?.length || 0} files</Text>
            </View>
        </View>
        <TouchableOpacity
            onPress={onGenerateQuestions}
            disabled={isGeneratingQuestions}
            className={`mt-2 rounded-lg px-3 py-2 flex-row items-center justify-center ${isGeneratingQuestions ? 'bg-orange-300' : 'bg-orange-500'}`}
        >
            {isGeneratingQuestions ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Ionicons name="sparkles-outline" size={16} color="white" />
            )}
            <Text className="text-white text-sm font-semibold ml-2">
                {isGeneratingQuestions ? 'Creating questions...' : 'Create Question Bank'}
            </Text>
        </TouchableOpacity>
    </View>
);

const LessonsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [generatingLessonId, setGeneratingLessonId] = useState<number | null>(null);

    const addLessonRef = React.useRef<ModalProp>(null);
    const editLessonRef = React.useRef<any>(null);
    const deleteConfirmRef = React.useRef<ModalProp>(null);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, subjectsRes, lessonsRes] = await Promise.all([
                GetClasses(),
                GetSubjects(),
                GetLessons()
            ]);

            if (classesRes.responseStatus === 200) {
                setClasses([{ label: 'All Classes', value: '' }, ...asArray(classesRes.responseData).map((c: any) => ({ label: c.name, value: c.id.toString() }))]);
            }
            if (subjectsRes.responseStatus === 200) {
                setSubjects([{ label: 'All Subjects', value: '' }, ...asArray(subjectsRes.responseData).map((s: any) => ({ label: s.name, value: s.id.toString() }))]);
            }
            if (lessonsRes.responseStatus === 200) {
                setLessons(asArray(lessonsRes.responseData));
            }
        } catch (error) {
            console.error('Error fetching lessons data:', error);
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

    const filteredLessons = (lessons || []).filter(lesson => {
        const matchesSearch = (lesson?.title || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
            (lesson?.content || "").toLowerCase().includes((searchTerm || "").toLowerCase());
        const matchesClass = !selectedClass || lesson?.classId?.toString() === selectedClass;
        const matchesSubject = !selectedSubject || lesson?.subjectId?.toString() === selectedSubject;
        return matchesSearch && matchesClass && matchesSubject;
    });

    const handleEdit = (lesson: any) => {
        editLessonRef.current?.open(lesson);
    };

    const handleDelete = (lesson: any) => {
        setSelectedLesson(lesson);
        deleteConfirmRef.current?.setVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedLesson) return;
        try {
            const res = await DeleteLesson(selectedLesson.id);
            if (res.responseStatus === 200) {
                showToast('Lesson deleted successfully');
                setLessons(lessons.filter(l => l.id !== selectedLesson.id));
            } else {
                showToast('Failed to delete lesson');
            }
        } catch (error) {
            console.error('Delete lesson error:', error);
            showToast('An error occurred while deleting');
        } finally {
            deleteConfirmRef.current?.setVisible(false);
        }
    };

    const handleGenerateQuestions = async (lesson: any) => {
        if (!lesson?.id) return;
        setGeneratingLessonId(lesson.id);
        try {
            const res = await GenerateQuestionsFromLesson(lesson.id, 10);
            if (res.responseStatus === 200 || res.responseStatus === 201) {
                showToast(`${res.responseData?.count || 0} questions created`);
            } else {
                Alert.alert('Error', res.responseData?.message || 'Failed to create questions from lesson note');
            }
        } catch (error) {
            console.error('Generate lesson questions error:', error);
            Alert.alert('Error', 'An error occurred while creating questions.');
        } finally {
            setGeneratingLessonId(null);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-3 border-b border-gray-100">
                <View className="flex-row gap-2 mb-3">
                    <View className="flex-1">
                        <Dropdown
                            style={{ height: 40, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: 'white' }}
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
                            style={{ height: 40, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, backgroundColor: 'white' }}
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
                        placeholder="Search lessons..."
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
                    data={filteredLessons}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
                    }
                    renderItem={({ item }) => (
                        <LessonCard
                            lesson={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                            onGenerateQuestions={() => handleGenerateQuestions(item)}
                            isGeneratingQuestions={generatingLessonId === item.id}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="book-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-2 text-center">No lessons found</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                onPress={() => addLessonRef.current?.setVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <AddLessonModal
                ref={addLessonRef}
                onSubmit={handleRefresh}
            />

            <EditLessonModal
                ref={editLessonRef}
                onSubmit={handleRefresh}
            />

            <DeleteConfirmModal
                ref={deleteConfirmRef}
                onConfirm={handleConfirmDelete}
                title="Delete Lesson"
                message="Are you sure you want to delete this lesson? This action cannot be undone."
                itemName={selectedLesson?.title}
            />
        </View>
    );
};

export default LessonsTab;
