import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MessageCardProps {
    title: string;
    message: string;
    date: string;
    receivers: string[];
    onEdit?: () => void;
    onDelete?: () => void;
}

const MessageCard = ({ title, message, date, receivers, onEdit, onDelete }: MessageCardProps) => {
    return (
        <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className="text-sm text-gray-500" numberOfLines={2}>
                        {message}
                    </Text>
                </View>
                {(onEdit || onDelete) && (
                    <View className="flex-row gap-2">
                        {onEdit && (
                            <TouchableOpacity onPress={onEdit} className="p-1">
                                <Ionicons name="create-outline" size={18} color="#F97316" />
                            </TouchableOpacity>
                        )}
                        {onDelete && (
                            <TouchableOpacity onPress={onDelete} className="p-1">
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            <View className="border-t border-gray-100 my-2" />

            <View className="flex-row justify-between items-center">
                <View className="flex-row flex-wrap gap-2 flex-1">
                    {receivers.map((receiver, index) => {
                        let label = receiver;
                        if (receiver === 'ALL_STUDENTS') label = 'Students';
                        else if (receiver === 'ALL_STAFF') label = 'Staff';
                        else if (receiver === 'ALL_GUARDIAN') label = 'Guardians';

                        return (
                            <View key={index} className="bg-orange-50 px-2 py-0.5 rounded">
                                <Text className="text-[10px] font-medium text-orange-600 uppercase">
                                    {label}
                                </Text>
                            </View>
                        );
                    })}
                </View>
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {date}
                </Text>
            </View>
        </View>
    );
};

export default MessageCard;
