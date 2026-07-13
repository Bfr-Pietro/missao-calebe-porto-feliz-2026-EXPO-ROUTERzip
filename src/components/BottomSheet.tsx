import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import { radius, shadow, spacing } from "../theme/spacing";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const OFFSCREEN_Y = 640;
const CLOSE_THRESHOLD = 120;
const springConfig = { damping: 18, stiffness: 190 };

/**
 * Bottom Sheet genérico e reutilizável: desliza de baixo para cima com
 * spring, possui backdrop com fade e pode ser fechado tocando fora ou
 * arrastando para baixo (React Native Gesture Handler + Reanimated).
 * Usado pelo Mapa Missionário para exibir detalhes de marcador e o
 * formulário de criação (administrador).
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children, style }) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(OFFSCREEN_Y);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, springConfig);
      backdropOpacity.value = withTiming(1, { duration: 220 });
    } else {
      translateY.value = withTiming(OFFSCREEN_Y, { duration: 220 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const requestClose = () => {
    translateY.value = withTiming(OFFSCREEN_Y, { duration: 220 });
    backdropOpacity.value = withTiming(0, { duration: 200 });
    onClose();
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_THRESHOLD) {
        translateY.value = withTiming(OFFSCREEN_Y, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 180 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, springConfig);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={requestClose} statusBarTranslucent>
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.overlay }, backdropStyle]}
        >
          <Pressable style={StyleSheet.absoluteFillObject} onPress={requestClose} />
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: theme.backgroundElevated,
                borderColor: theme.border,
                paddingBottom: insets.bottom + spacing.lg,
              },
              shadow.lg,
              sheetStyle,
              style,
            ]}
          >
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    maxHeight: "88%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
});
