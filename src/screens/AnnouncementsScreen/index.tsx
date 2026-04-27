import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/components/UI/ScreenContainer';
import { BackBtn } from '@/src/components/UI/Buttons/BackBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import { GetAnnouncements, GetNotifications, MarkNotificationRead } from '@/src/services/communication';
import moment from 'moment';

interface AnnouncementItem {
    id: string | number;
    title: string;
    message: string;
    createdAt: string;
    priority?: string;
    isRead?: boolean;
}

const formatDate = (dateString: string) => {
    return moment(dateString).format('MMM D, YYYY • h:mm A');
};

const AnnouncementCard = ({
    item,
    isNotification = false,
    onPress,
}: {
    item: AnnouncementItem,
    isNotification?: boolean,
    onPress?: () => void,
}) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className={`bg-white rounded-xl p-4 mb-3 border ${isNotification && !item.isRead ? 'border-orange-200 bg-orange-50' : 'border-gray-100'} shadow-sm`}
    >
        <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-2">
                <View className="flex-row items-center gap-2 mb-1">
                    {item.priority === 'high' && (
                        <View className="bg-red-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-bold text-red-600">URGENT</Text>
                        </View>
                    )}
                    <Text className="text-base font-bold text-gray-900 flex-1" numberOfLines={1}>
                        {item.title}
                    </Text>
                </View>
            </View>
        </View>
        <Text className="text-sm text-gray-600 mb-3">
            {item.message}
        </Text>
        <View className="flex-row items-center">
            <Ionicons name="time-outline" size={12} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 ml-1">{formatDate(item.createdAt)}</Text>
        </View>
    </TouchableOpacity>
);

const AnnouncementsScreen = ({
    navigation,
}: {
    navigation: StackNavigationProp<any, any>;
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'personal'>('general');
    const [items, setItems] = useState<AnnouncementItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'general') {
                const { responseData, responseStatus } = await GetAnnouncements();
                if (responseStatus === 200) {
                    setItems(responseData || []);
                }
            } else {
                const { responseData, responseStatus } = await GetNotifications(true);
                if (responseStatus === 200) {
                    setItems(responseData || []);
                }
            }
        } catch (error) {
            console.error("fetchData error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handlePressNotification = async (item: AnnouncementItem) => {
        if (activeTab !== "personal" || item.isRead) return;
        try {
            await MarkNotificationRead(Number(item.id));
            setItems((prev) =>
                prev.map((entry) =>
                    entry.id === item.id ? { ...entry, isRead: true } : entry
                )
            );
        } catch (error) {
            console.error("handlePressNotification error:", error);
        }
    };

    return (
        <ScreenContainer>
            {/* Header */}
            <View className="px-4 mb-6">
                <View className="flex-row items-center">
                    <BackBtn />
                    <Text className="text-xl font-bold text-gray-900 ml-5">Announcements</Text>
                </View>
            </View>

            {/* Tab Navigation */}
            <View className="bg-white px-4 py-3 flex-row border-b border-gray-100">
                <TouchableOpacity
                    onPress={() => setActiveTab('general')}
                    className={`flex-1 py-2.5 rounded-lg mr-2 ${activeTab === 'general' ? 'bg-orange-500' : 'bg-gray-100'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'general' ? 'text-white' : 'text-gray-600'}`}>
                        General
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('personal')}
                    className={`flex-1 py-2.5 rounded-lg ml-2 ${activeTab === 'personal' ? 'bg-orange-500' : 'bg-gray-100'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'personal' ? 'text-white' : 'text-gray-600'}`}>
                        For You
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Announcement List */}
            {loading && !refreshing ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#F97316" size="large" />
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F97316"]} />
                    }
                    renderItem={({ item }) => (
                        <AnnouncementCard 
                            item={item} 
                            isNotification={activeTab === 'personal'} 
                            onPress={() => handlePressNotification(item)}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-20">
                            <Ionicons name="megaphone-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-2">No {activeTab === 'general' ? 'announcements' : 'notifications'} found</Text>
                        </View>
                    )}
                />
            )}
        </ScreenContainer>
    );
};

export default AnnouncementsScreen;
