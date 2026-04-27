import { useRef } from "react";
import { PanResponder } from "react-native";

/**
 * Returns pan responder handlers that close the containing bottom sheet
 * when the user drags the handle bar downward past a threshold or with
 * enough velocity. Drop the returned `panHandlers` onto any `<View>` at
 * the top of a modal/bottom-sheet so the user can swipe the handle bar
 * to dismiss it, matching native iOS/Android conventions.
 *
 * Example:
 *   const panHandlers = useDragToClose(() => setVisible(false));
 *   <View {...panHandlers}>
 *     <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
 *   </View>
 */
export function useDragToClose(onClose: () => void, options?: { threshold?: number; velocity?: number }) {
  const threshold = options?.threshold ?? 80;
  const velocity = options?.velocity ?? 0.6;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gesture) =>
        gesture.dy > 8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderRelease: (_e, gesture) => {
        if (gesture.dy > threshold || gesture.vy > velocity) {
          onClose();
        }
      },
    }),
  ).current;

  return panResponder.panHandlers;
}

export default useDragToClose;
