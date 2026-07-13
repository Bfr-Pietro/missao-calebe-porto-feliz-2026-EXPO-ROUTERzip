import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { radius, spacing } from "../theme/spacing";
import { pressAnimationConfig } from "../animations/transitions";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
}) => {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(pressAnimationConfig.scaleDown, {
      duration: pressAnimationConfig.duration,
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: pressAnimationConfig.duration });
  };

  const content = (
    <AppText variant="button" color={variant === "outline" ? theme.primary : theme.textInverse}>
      {label}
    </AppText>
  );

  const baseStyle = [
    styles.base,
    variant === "outline" && { borderWidth: 1.5, borderColor: theme.primary, backgroundColor: "transparent" },
    disabled && { opacity: 0.5 },
    style,
  ];

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, baseStyle]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[theme.primary, theme.primaryPressed]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {variant === "secondary" ? (
        <LinearGradient
          colors={[theme.secondary, theme.secondary]}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {variant === "danger" ? (
        <LinearGradient
          colors={[theme.danger, theme.danger]}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {content}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    overflow: "hidden",
  },
});
