import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../components/AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius } from "../theme/spacing";

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = "Carregando..." }) => {
  const { theme } = useAppTheme();
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[styles.skeletonCircle, { backgroundColor: theme.surfaceMuted }, animatedStyle]}
      />
      <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.md }}>
        {message}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
});
