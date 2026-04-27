import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Max height as a fraction of the screen (default 0.85). */
  maxHeightRatio?: number;
  /** Content rendered inside the sheet. */
  children: React.ReactNode;
  /** Optional override for the backdrop colour. */
  backdropOpacity?: number;
  /** Extra class names for the sheet container. */
  contentClassName?: string;
};

const DRAG_CLOSE_THRESHOLD = 120;
const DRAG_VELOCITY_THRESHOLD = 0.8;

/**
 * Shared bottom-sheet primitive used by every modal so they all
 * support the same drag-down-to-close gesture + tap-backdrop-to-close
 * behaviour. Built on top of React Native's built-in Animated +
 * PanResponder so no extra dependency is required.
 */
const DraggableBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  children,
  maxHeightRatio = 0.85,
  backdropOpacity = 0.5,
  contentClassName = "",
}) => {
  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const close = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(screenHeight);
      Animated.spring(translateY, {
        toValue: 0,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(screenHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gesture) => gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_e, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_e, gesture) => {
        if (gesture.dy > DRAG_CLOSE_THRESHOLD || gesture.vy > DRAG_VELOCITY_THRESHOLD) {
          close();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
      <View style={StyleSheet.absoluteFill}>
        <Pressable
          onPress={close}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: `rgba(0,0,0,${backdropOpacity})`,
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: screenHeight * maxHeightRatio,
            transform: [{ translateY }],
          }}
          className={`bg-white rounded-t-3xl pb-6 ${contentClassName}`}
        >
          <View {...panResponder.panHandlers} className="items-center pt-3 pb-2">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>
          <View className="px-6">{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default DraggableBottomSheet;
