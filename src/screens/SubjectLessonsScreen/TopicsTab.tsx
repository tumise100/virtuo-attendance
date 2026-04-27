import { asArray } from '@/src/utils';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import AddTopicModal from './AddTopicModal';
import EditTopicModal from './EditTopicModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ModalProp } from '@/src/shared';
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { GetTopics, DeleteTopic } from '@/src/services/topic';
import { showToast } from '@/src/components/UI/showToast';

const TopicCard = ({
    topic,
    onEdit,
    onDelete
}: {
    topic: any;
    onEdit: () => void;
    onDelete: () => void;
}) => (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
                <Text className="text-base font-bold text-gray-900 mb-2" numberOfLines={1}>
                    {topic.title}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                    <View className="bg-blue-50 px-2.5 py-1 rounded-full flex-row items-center">
                        <Ionicons name="school-outline" size={12} color="#3B82F6" />
                        <Text className="text-xs font-medium text-blue-600 ml-1">{topic.class?.name || 'N/A'}</Text>
                    </View>
                    <View className="bg-purple-50 px-2.5 py-1 rounded-full flex-row items-center">
                        <Ionicons name="book-outline" size={12} color="#8B5CF6" />
                        <Text className="text-xs font-medium text-purple-600 ml-1">{topic.subject?.name || 'N/A'}</Text>
                    </View>
                </View>
            </View>
            <View className="flex-row gap-2">
                <TouchableOpacity onPress={onEdit} className="p-2">
                    <Ionicons name="create-outline" size={20} color="#F97316" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} className="p-2">
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const TopicsTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const addTopicRef = React.useRef<ModalProp>(null);
    const editTopicRef = React.useRef<any>(null);
    const deleteConfirmRef = React.useRef<ModalProp>(null);
    const [selectedTopic, setSelectedTopic] = useState<any>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesRes, subjectsRes, topicsRes] = await Promise.all([
                GetClasses(),
                GetSubjects(),
                GetTopics()
            ]);

            if (classesRes.responseStatus === 200) {
                setClasses([{ label: 'All Classes', value: '' }, ...asArray(classesRes.responseData).map((c: any) => ({ label: c.name, value: c.id.toString() }))]);
            }
            if (subjectsRes.responseStatus === 200) {
                setSubjects([{ label: 'All Subjects', value: '' }, ...asArray(subjectsRes.responseData).map((s: any) => ({ label: s.name, value: s.id.toString() }))]);
            }
            if (topicsRes.responseStatus === 200) {
                setTopics(asArray(topicsRes.responseData));
            }
        } catch (error) {
            console.error('Error fetching topics data:', error);
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

    const filteredTopics = (topics || []).filter(topic => {
        const matchesSearch = (topic?.title || "").toLowerCase().includes((searchTerm || "").toLowerCase());
        const matchesClass = !selectedClass || topic?.classId?.toString() === selectedClass;
        const matchesSubject = !selectedSubject || topic?.subjectId?.toString() === selectedSubject;
        return matchesSearch && matchesClass && matchesSubject;
    });

    const handleEdit = (topic: any) => {
        editTopicRef.current?.open(topic);
    };

    const handleDelete = (topic: any) => {
        setSelectedTopic(topic);
        deleteConfirmRef.current?.setVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTopic) return;
        try {
            const res = await DeleteTopic(selectedTopic.id);
            if (res.responseStatus === 200) {
                showToast('Topic deleted successfully');
                setTopics(topics.filter(t => t.id !== selectedTopic.id));
            } else {
                showToast('Failed to delete topic');
            }
        } catch (error) {
            console.error('Delete topic error:', error);
            showToast('An error occurred while deleting');
        } finally {
            deleteConfirmRef.current?.setVisible(false);
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
                        placeholder="Search topics..."
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
                    data={filteredTopics}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" />
                    }
                    renderItem={({ item }) => (
                        <TopicCard
                            topic={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="list-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-2 text-center">No topics found</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg"
                onPress={() => addTopicRef.current?.setVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            <AddTopicModal
                ref={addTopicRef}
                onSubmit={handleRefresh}
            />

            <EditTopicModal
                ref={editTopicRef}
                onSubmit={handleRefresh}
            />

            <DeleteConfirmModal
                ref={deleteConfirmRef}
                onConfirm={handleConfirmDelete}
                title="Delete Topic"
                message="Are you sure you want to delete this topic? This action cannot be undone."
                itemName={selectedTopic?.title}
            />
        </View>
    );
};

export default TopicsTab;