import React from "react";
import { Text, TouchableOpacity, ActivityIndicator, TouchableOpacityProps } from "react-native";
import { COLORS } from "@/src/theme/colors";

interface PrimaryButtonProps extends TouchableOpacityProps {
    text: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const PrimaryButton = ({
    text,
    isLoading,
    variant = 'primary',
    className,
    ...props
}: PrimaryButtonProps) => {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return "bg-orange-500";
            case 'secondary': return "bg-gray-200";
            case 'danger': return "bg-red-500";
            default: return "bg-orange-500";
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return "text-white";
            case 'secondary': return "text-gray-900";
            case 'danger': return "text-white";
            default: return "text-white";
        }
    };

    return (
        <TouchableOpacity
            className={`${getBackgroundColor()} rounded-xl py-4 items-center justify-center shadow-sm ${variant === 'primary' ? 'shadow-orange-200' : ''} ${className}`}
            disabled={isLoading || props.disabled}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text className={`${getTextColor()} font-bold text-base`}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};
