import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { COLORS } from '@/src/theme/colors';
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const currentYear = new Date().getFullYear();

const YEAR_OPTIONS = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => {
    const year = (1960 + i).toString();
    return { label: year, value: year };
}).reverse();

const MONTH_OPTIONS = [
    { label: "January", value: "january" },
    { label: "February", value: "february" },
    { label: "March", value: "march" },
    { label: "April", value: "april" },
    { label: "May", value: "may" },
    { label: "June", value: "June" },
    { label: "July", value: "july" },
    { label: "August", value: "august" },
    { label: "September", value: "september" },
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
];

const FilterMessageModal = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [year, setYear] = useState<string | null>(null);
    const [month, setMonth] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
        setVisible: (val: boolean) => setVisible(val),
    }));

    const closeModal = () => setVisible(false);

    const handleApply = () => {
        console.log("Applying Filter:", { year, month });
        closeModal();
    };

    const handleClear = () => {
        setYear(null);
        setMonth(null);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <Pressable className="flex-1 bg-black/50 justify-end" onPress={closeModal}>
                <Pressable className="bg-white rounded-t-3xl p-6 pb-10" onPress={(e) => e.stopPropagation()}>
                    {/* Handle bar */}
                    <View className="items-center mb-6">
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </View>

                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-lg font-bold text-gray-900">Filter Messages</Text>
                        <TouchableOpacity onPress={closeModal}>
                            <AntDesign name="close" size={24} color={COLORS.textColor} />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Year</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={YEAR_OPTIONS}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Year"
                            searchPlaceholder="Search..."
                            value={year}
                            onChange={item => {
                                setYear(item.value);
                            }}
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2">Month</Text>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={MONTH_OPTIONS}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Month"
                            value={month}
                            onChange={item => {
                                setMonth(item.value);
                            }}
                        />
                    </View>

                    <View className="flex-row gap-3">
                        <Button
                            mode="outlined"
                            onPress={handleClear}
                            style={styles.buttonOutlined}
                            textColor={COLORS.textColor}
                        >
                            Clear
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleApply}
                            style={styles.buttonContained}
                            buttonColor={COLORS.primary[500]}
                        >
                            Apply Filter
                        </Button>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
});

const styles = {
    dropdown: {
        height: 50,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    buttonOutlined: {
        flex: 1,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center' as 'center',
        borderColor: '#D1D5DB',
    },
    buttonContained: {
        flex: 1,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center' as 'center',
    },
};

export default FilterMessageModal;
