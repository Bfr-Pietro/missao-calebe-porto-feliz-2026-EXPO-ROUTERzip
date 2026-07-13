import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../components/AppText";
import { useAppTheme } from "../context/ThemeContext";
import { MISSION } from "../constants";
import { spacing } from "../theme/spacing";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { theme } = useAppTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) });

    const timeout = setTimeout(() => {
      onFinish?.();
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={[theme.primary, theme.primaryPressed]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={[styles.logoBadge, { backgroundColor: theme.textInverse }]}>
          <AppText variant="h1" color={theme.secondary}>
            CALEBE
          </AppText>
        </View>
        <AppText variant="h2" color={theme.textInverse} center style={{ marginTop: spacing.lg }}>
          {MISSION.name}
        </AppText>
        <AppText variant="body" color={theme.textInverse} center style={{ marginTop: spacing.xxs }}>
          {MISSION.slogan}
        </AppText>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  logoBadge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 999,
  },
});
