import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/theme/colors';

interface HolidayProps {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    date?: string;
}

interface HolidayCardProps {
    holiday: HolidayProps;
    onEdit?: () => void;
    onDelete?: () => void;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateRange = (startDate?: string, endDate?: string, fallbackDate?: string) => {
    const start = startDate || fallbackDate;
    if (!start) return "No date";

    const startFormatted = formatDate(start);
    const endFormatted = formatDate(endDate);

    if (!endDate || startFormatted === endFormatted) {
        return startFormatted;
    }

    return `${startFormatted} - ${endFormatted}`;
};

const HolidayCard = ({ holiday, onEdit, onDelete }: HolidayCardProps) => {
    const dateRange = formatDateRange(holiday.startDate, holiday.endDate, holiday.date);

    return (
        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                        <Ionicons name="calendar-outline" size={14} color={COLORS.neutral[500]} />
                        <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                            {holiday.name}
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-500 mb-3" numberOfLines={2}>
                        {holiday.description || "No description"}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
                <View className="bg-green-50 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-700">
                        {dateRange}
                    </Text>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                    {onEdit && (
                        <TouchableOpacity onPress={onEdit} className="flex-row items-center gap-1">
                            <Ionicons name="create-outline" size={16} color="#F97316" />
                            <Text className="text-xs font-medium text-orange-500">Edit</Text>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity onPress={onDelete} className="flex-row items-center gap-1">
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                            <Text className="text-xs font-medium text-red-500">Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default HolidayCard;
