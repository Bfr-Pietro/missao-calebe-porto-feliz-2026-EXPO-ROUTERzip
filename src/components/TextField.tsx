import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { radius, spacing } from "../theme/spacing";

interface TextFieldProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ label, errorMessage, style, onFocus, onBlur, ...rest }) => {
  const { theme } = useAppTheme();
  const borderProgress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: errorMessage
      ? theme.danger
      : borderProgress.value === 1
      ? theme.primary
      : theme.border,
  }));

  return (
    <View style={{ marginBottom: spacing.md }}>
      <AppText variant="caption" color={theme.textSecondary} style={{ marginBottom: spacing.xxs }}>
        {label}
      </AppText>
      <Animated.View
        style={[
          {
            borderWidth: 1.5,
            borderRadius: radius.md,
            backgroundColor: theme.surface,
          },
          animatedStyle,
        ]}
      >
        <TextInput
          placeholderTextColor={theme.textSecondary}
          style={[
            {
              height: 52,
              paddingHorizontal: spacing.md,
              color: theme.textPrimary,
              fontSize: 16,
            },
            style,
          ]}
          onFocus={(e) => {
            borderProgress.value = withTiming(1, { duration: 150 });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            borderProgress.value = withTiming(0, { duration: 150 });
            onBlur?.(e);
          }}
          {...rest}
        />
      </Animated.View>
      {errorMessage ? (
        <AppText variant="caption" color={theme.danger} style={{ marginTop: spacing.xxs }}>
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
};
