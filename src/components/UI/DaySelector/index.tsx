import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { COLORS } from '@/src/theme/colors';

interface DaySelectorProps {
    days: string[];
    selectedDay: string;
    onSelectDay: (day: string) => void;
}

const DaySelector = ({ days, selectedDay, onSelectDay }: DaySelectorProps) => {
    return (
        <View className="mb-4 pt-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            >
                {days.map((day) => {
                    const isSelected = selectedDay === day;
                    return (
                        <TouchableOpacity
                            key={day}
                            onPress={() => onSelectDay(day)}
                            activeOpacity={0.7}
                            className={`mr-3 px-5 py-2.5 rounded-2xl border shadow-sm ${isSelected
                                    ? 'bg-orange-500 border-orange-500'
                                    : 'bg-white border-gray-100'
                                }`}
                            style={!isSelected ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : {}}
                        >
                            <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                {day.slice(0, 3)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default DaySelector;
