import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme/spacing";
import { MISSION } from "../constants";

export const Footer: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <View style={{ padding: spacing.xl, alignItems: "center" }}>
      <AppText variant="caption" color={theme.textSecondary} center>
        {MISSION.church}
      </AppText>
      <AppText variant="caption" color={theme.textSecondary} center style={{ marginTop: spacing.xxs }}>
        01/07/2026 — 01/08/2026
      </AppText>
    </View>
  );
};
