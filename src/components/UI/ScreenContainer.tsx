import React, { ReactNode } from "react";
import { View, StyleProp, ViewStyle, StatusBar } from "react-native";
import { COLORS } from "@/src/theme/colors";

interface ScreenContainerProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    paddingTop?: number; // Custom top padding if needed, defaults to standard
}

export const ScreenContainer = ({
    children,
    style,
    backgroundColor = COLORS.white,
    paddingTop = 56, // Standard unified top padding (pt-14 equivalent)
}: ScreenContainerProps) => {
    return (
        <View
            style={[
                { flex: 1, backgroundColor, paddingTop },
                style,
            ]}
        >
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle="dark-content"
                animated
            />
            {children}
        </View>
    );
};
