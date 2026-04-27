import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '@/src/components/UI/ScreenContainer';
import { BackBtn } from '@/src/components/UI/Buttons/BackBtn';
import { StackNavigationProp } from '@react-navigation/stack';
import LessonsTab from './LessonsTab';
import TopicsTab from './TopicsTab';

const TABS = ['Lessons', 'Topics'] as const;
type TabType = typeof TABS[number];

const SubjectLessonsScreen = ({
    navigation,
}: {
    navigation: StackNavigationProp<any, any>;
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('Lessons');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Lessons':
                return <LessonsTab />;
            case 'Topics':
                return <TopicsTab />;
            default:
                return null;
        }
    };

    return (
        <ScreenContainer>
            {/* Header */}
            <View className="flex-row items-center px-4 mb-6">
                <BackBtn />
                <Text className="text-xl font-bold text-gray-900 ml-5">Subject Lessons</Text>
            </View>


            {/* Tab Navigation */}
            <View className="flex-row px-4 py-3 bg-white border-b border-gray-100">
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 rounded-lg mr-2 ${activeTab === tab ? 'bg-orange-500' : 'bg-gray-100'}`}
                    >
                        <Text className={`text-center font-semibold ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tab Content */}
            <View className="flex-1">
                {renderTabContent()}
            </View>
        </ScreenContainer>
    );
};

export default SubjectLessonsScreen;
