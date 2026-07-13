import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { spacing } from "../theme/spacing";
import { useAppTheme } from "../context/ThemeContext";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle }) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
      <AppText variant="h2">{title}</AppText>
      {subtitle ? (
        <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xxs }}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
};
