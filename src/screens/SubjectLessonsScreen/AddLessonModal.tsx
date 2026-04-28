import { asArray } from '@/src/utils';
import { useDragToClose } from "@/src/components/UI/useDragToClose";
import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
    Modal,
    Pressable,
    KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { GetClasses } from '@/src/services/class';
import { GetSubjects } from '@/src/services/courses';
import { CreateLesson, GenerateLessonNoteFromDocument } from '@/src/services/lesson';
import { GetTopics, CreateTopic } from '@/src/services/topic';
import { GetCurrentSession } from '@/src/services/academic-session';
import { showToast } from '@/src/components/UI/showToast';
import { combineStore } from '@/src/store';

interface AddLessonModalProps {
    onSubmit: () => void;
}

const AddLessonModal = forwardRef((props: AddLessonModalProps, ref) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    // Data lists
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [isProcessingOCR, setIsProcessingOCR] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { activeTermId } = combineStore();

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const dragHandlers = useDragToClose(() => setVisible(false));

    useEffect(() => {
        if (visible) {
            fetchInitialData();
        }
    }, [visible]);

    useEffect(() => {
        if (!selectedClass || !selectedSubject) {
            setTopics([]);
            setSelectedTopic('');
            return;
        }
        fetchTopics(selectedClass, selectedSubject);
    }, [selectedClass, selectedSubject]);

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

    const fetchTopics = async (classId: string, subjectId: string) => {
        try {
            const res = await GetTopics({ classId, subjectId });
            if (res.responseStatus === 200) {
                const topicOptions = asArray(res.responseData).map((topic: any) => ({
                    label: topic.title || topic.name,
                    value: topic.id.toString(),
                    title: topic.title || topic.name,
                }));
                setTopics(topicOptions);
                setSelectedTopic((prev) =>
                    topicOptions.some((t: any) => t.value === prev) ? prev : ''
                );
            } else {
                setTopics([]);
                setSelectedTopic('');
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            setTopics([]);
            setSelectedTopic('');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSelectedClass('');
        setSelectedSubject('');
        setSelectedTopic('');
        setTopicTitle('');
        setDocuments([]);
        setCapturedImage(null);
    };

    const handleClose = () => {
        setVisible(false);
        resetForm();
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
            let resolvedTopicId: number | undefined;
            let resolvedTopicTitle = topicTitle.trim();

            if (!resolvedTopicTitle && selectedTopic) {
                const matched = topics.find((t: any) => t.value === selectedTopic);
                resolvedTopicTitle = matched?.title || matched?.label || '';
            }

            if (!resolvedTopicTitle) {
                Alert.alert('Error', 'Please select or enter a topic');
                setLoading(false);
                return;
            }

            if (selectedTopic) {
                resolvedTopicId = Number(selectedTopic);
            } else {
                let resolvedTermId = activeTermId ? Number(activeTermId) : null;
                if (!resolvedTermId) {
                    const currentSessionRes = await GetCurrentSession();
                    if (currentSessionRes.responseStatus === 200) {
                        resolvedTermId = Number(currentSessionRes.responseData?.term?.id || 0) || null;
                    }
                }
                if (!resolvedTermId) {
                    Alert.alert('Error', 'No active term found. Please select a term from Home first.');
                    setLoading(false);
                    return;
                }
                const existing = topics.find(
                    (t: any) =>
                        String(t.title || t.label || '')
                            .toLowerCase()
                            .trim() === resolvedTopicTitle.toLowerCase().trim()
                );
                if (existing?.value) {
                    resolvedTopicId = Number(existing.value);
                } else {
                    const created = await CreateTopic({
                        title: resolvedTopicTitle,
                        classId: Number(selectedClass),
                        subjectId: Number(selectedSubject),
                        termId: resolvedTermId,
                    });

                    if (created.responseStatus === 200 || created.responseStatus === 201) {
                        const newTopic = created.responseData;
                        resolvedTopicId = Number(newTopic?.id);
                    } else {
                        Alert.alert('Error', created.responseData?.message || 'Failed to create topic');
                        setLoading(false);
                        return;
                    }
                }
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('classId', selectedClass);
            formData.append('subjectId', selectedSubject);
            formData.append('topicId', String(resolvedTopicId || ''));

            // Add documents if any
            documents.forEach((doc, index) => {
                formData.append('files', {
                    uri: Platform.OS === 'ios' ? doc.uri.replace('file://', '') : doc.uri,
                    name: doc.name || `file_${index}`,
                    type: doc.mimeType || 'application/octet-stream',
                } as any);
            });

            const res = await CreateLesson(formData);

            if (res.responseStatus === 201 || res.responseStatus === 200) {
                showToast('Lesson created successfully');
                props.onSubmit();
                handleClose();
            } else {
                Alert.alert('Error', res.responseData.message || 'Failed to create lesson');
            }
        } catch (error) {
            console.error('Create lesson error:', error);
            Alert.alert('Error', 'An error occurred while saving the lesson.');
        } finally {
            setLoading(false);
        }
    };

    const processScannedAsset = async (asset: ImagePicker.ImagePickerAsset, fallbackName: string) => {
        const imageUri = asset.uri;
        setCapturedImage(imageUri);
        setIsProcessingOCR(true);

        try {
            const formData = new FormData();
            const name = asset.fileName || imageUri.split('/').pop() || fallbackName;
            const type = asset.mimeType || 'image/jpeg';

            formData.append('file', {
                uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
                name,
                type,
            } as any);
            if (title.trim()) formData.append('title', title.trim());
            if (selectedClass) formData.append('classId', selectedClass);
            if (selectedSubject) formData.append('subjectId', selectedSubject);

            const res = await GenerateLessonNoteFromDocument(formData);
            if (res.responseStatus === 200 || res.responseStatus === 201) {
                const generated = res.responseData || {};
                if (!title.trim() && generated.title) {
                    setTitle(generated.title);
                }
                if (generated.content) {
                    setContent(generated.content);
                    Alert.alert('Success', 'Lesson note generated from scanned document.');
                } else {
                    Alert.alert('Error', 'The scan completed but no lesson note was generated. Try a clearer image.');
                }
            } else {
                Alert.alert('Error', res.responseData?.message || 'Failed to scan lesson note');
            }
        } catch (error) {
            console.error('OCR lesson note error:', error);
            Alert.alert('Error', 'Failed to scan the document. Please try again.');
        } finally {
            setIsProcessingOCR(false);
        }
    };

    const handleOCRCapture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera permission is needed to scan notes');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            await processScannedAsset(result.assets[0], 'lesson-note-scan.jpg');
        }
    };

    const handleGalleryOCR = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Gallery permission is needed to select images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            await processScannedAsset(result.assets[0], 'lesson-note-image.jpg');
        }
    };

    const handleDocumentPick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets[0]) {
                setDocuments(prev => [...prev, result.assets[0]]);
            }
        } catch (error) {
            console.log('Document picker error:', error);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
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
                        <Text className="text-xl font-bold text-gray-900">Create Lesson</Text>
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

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Topic *</Text>
                                <Dropdown
                                    style={{ height: 48, borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 }}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    data={topics}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={selectedClass && selectedSubject ? (topics.length ? "Select topic" : "No topic found") : "Select class & subject first"}
                                    value={selectedTopic}
                                    onChange={item => {
                                        setSelectedTopic(item.value);
                                        setTopicTitle(item.title || item.label || '');
                                    }}
                                    disable={!selectedClass || !selectedSubject || topics.length === 0}
                                    renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="gray" />}
                                />
                                <TextInput
                                    value={topicTitle}
                                    onChangeText={(text) => {
                                        setTopicTitle(text);
                                        if (selectedTopic) setSelectedTopic('');
                                    }}
                                    placeholder="Type topic (auto-creates if not existing)"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base mt-2"
                                    placeholderTextColor="#9CA3AF"
                                />
                                {!!selectedClass && !!selectedSubject && topics.length === 0 && (
                                    <Text className="text-xs text-amber-600 mt-1">
                                        No topic exists yet. Type a topic above and it will be created automatically.
                                    </Text>
                                )}
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Lesson Content</Text>
                                <TextInput
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Type your lesson content here..."
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    className="border border-gray-200 rounded-lg px-3 py-3 text-base min-h-[120px]"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Scan Notes (OCR)</Text>
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleOCRCapture}
                                        disabled={isProcessingOCR}
                                        className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-3 items-center"
                                    >
                                        <Ionicons name="camera" size={20} color="#F97316" />
                                        <Text className="text-xs font-medium text-orange-600 mt-1">Take Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleGalleryOCR}
                                        disabled={isProcessingOCR}
                                        className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 items-center"
                                    >
                                        <Ionicons name="images" size={20} color="#3B82F6" />
                                        <Text className="text-xs font-medium text-blue-600 mt-1">From Gallery</Text>
                                    </TouchableOpacity>
                                </View>

                                {isProcessingOCR && (
                                    <View className="mt-2 flex-row items-center justify-center py-2">
                                        <ActivityIndicator size="small" color="#F97316" />
                                        <Text className="ml-2 text-xs text-gray-600">Extracting text...</Text>
                                    </View>
                                )}

                                {capturedImage && !isProcessingOCR && (
                                    <View className="mt-2">
                                        <Image source={{ uri: capturedImage }} className="w-full h-24 rounded-lg" resizeMode="cover" />
                                    </View>
                                )}
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 mb-2">Attach Documents</Text>
                                <TouchableOpacity
                                    onPress={handleDocumentPick}
                                    className="border border-dashed border-gray-300 rounded-xl p-4 items-center flex-row justify-center bg-gray-50"
                                >
                                    <Ionicons name="cloud-upload-outline" size={20} color="#6B7280" />
                                    <Text className="text-sm font-medium text-gray-600 ml-2">Upload Files</Text>
                                </TouchableOpacity>

                                {documents.length > 0 && (
                                    <View className="mt-3">
                                        {documents.map((doc, index) => (
                                            <View key={index} className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2">
                                                <View className="flex-row items-center flex-1">
                                                    <Ionicons name="document-text" size={16} color="#6B7280" />
                                                    <Text className="text-xs text-gray-700 ml-2 flex-1" numberOfLines={1}>{doc.name}</Text>
                                                </View>
                                                <TouchableOpacity onPress={() => removeDocument(index)} className="p-1">
                                                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                className={`bg-orange-500 rounded-xl py-4 items-center mb-6 ${loading ? 'opacity-70' : ''}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-bold text-base">Create Lesson</Text>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

export default AddLessonModal;
