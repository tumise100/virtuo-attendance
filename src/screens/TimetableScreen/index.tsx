import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/src/components/UI/ScreenContainer";
import { COLORS } from "@/src/theme/colors";
import { BackBtn } from "@/src/components/UI/Buttons/BackBtn";
import { SubheadingSemibold18 } from "@/src/theme/typography";
import StudentTimetableTab from "./StudentTimetableTab";
import TeacherTimetableTab from "./TeacherTimetableTab";
import HolidaysTab from "./HolidaysTab";
import { StackNavigationProps } from "@/src/shared";

type TabType = 'Student' | 'Teachers' | 'Holidays';

const TimetableScreen = ({ navigation }: StackNavigationProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('Student');

    const renderTab = (tab: TabType) => (
        <TouchableOpacity
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center justify-center border-b-2 py-3 ${activeTab === tab ? 'border-orange-500' : 'border-transparent'
                }`}
        >
            <Text className={`font-semibold ${activeTab === tab ? 'text-orange-500' : 'text-gray-500'
                }`}>
                {tab}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer>
            {/* Header */}
            <View className="px-4 mb-3 flex-row items-center">
                <BackBtn />
                <SubheadingSemibold18 text="Timetable" customClassName="ml-4 text-gray-900" />
            </View>


            {/* Custom Tabs */}
            <View className="flex-row border-b border-gray-100 mb-1">
                {renderTab('Student')}
                {renderTab('Teachers')}
                {renderTab('Holidays')}
            </View>

            {/* Content */}
            <View className="flex-1">
                {activeTab === 'Student' && <StudentTimetableTab />}
                {activeTab === 'Teachers' && <TeacherTimetableTab />}
                {activeTab === 'Holidays' && <HolidaysTab />}
            </View>
        </ScreenContainer>
    );
};

export default TimetableScreen;
