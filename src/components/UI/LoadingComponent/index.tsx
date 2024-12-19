import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";

function LoadingComponent() {
  const opacity = useSharedValue(0.2);

  // Set the opacity value to animate between 0 and 1

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  return (
    <Animated.View style={style}>
      <View role="status" className="max-w-sm animate-pulse mr-3 mb-3">
        <View className="h-2.5 bg-gray3 rounded-full dark:bg-veryLightBaseColor w-48 mb-4"></View>
        <View className="h-2 bg-gray3 rounded-full dark:bg-veryLightBaseColor max-w-[360px] mb-2.5"></View>
        <View className="h-2 bg-gray3 rounded-full dark:bg-veryLightBaseColor mb-2.5"></View>
        <View className="h-2 bg-gray3 rounded-full dark:bg-veryLightBaseColor max-w-[330px] mb-2.5"></View>
        <View className="h-2 bg-gray3 rounded-full dark:bg-veryLightBaseColor max-w-[300px] mb-2.5"></View>
        <View className="h-2 bg-gray3 rounded-full dark:bg-veryLightBaseColor max-w-[360px]"></View>
        <Text className="sr-only">Loading...</Text>
      </View>
    </Animated.View>
  );
}

export const ScrollViewLoading = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-5 mt-2"
    >
      <LoadingComponent />
      <LoadingComponent />
      <LoadingComponent />
    </ScrollView>
  );
};

export const TextLoading = () => {
  const opacity = useSharedValue(0.2);

  // Set the opacity value to animate between 0 and 1

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }), []);

  return (
    <Animated.View style={style} className={"ml-2"}>
      <View className="h-1 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></View>
      <View className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-40 my-1"></View>
      <View className="h-1 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></View>
    </Animated.View>
  );
};

export default LoadingComponent;
