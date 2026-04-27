import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../theme/colors';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    return (
        <View className="flex-row items-center justify-between px-4 py-4 border-t border-gray-100 mt-auto bg-white">
            <TouchableOpacity
                onPress={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex-row items-center px-3 py-2 rounded-lg border ${currentPage === 1 ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'
                    }`}
            >
                <Ionicons
                    name="arrow-back"
                    size={16}
                    color={currentPage === 1 ? COLORS.gray3 : COLORS.black}
                />
            </TouchableOpacity>

            <Text className="text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
                onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex-row items-center px-3 py-2 rounded-lg border ${currentPage === totalPages ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'
                    }`}
            >
                <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={currentPage === totalPages ? COLORS.gray3 : COLORS.black}
                />
            </TouchableOpacity>
        </View>
    );
};

export default PaginationControls;
