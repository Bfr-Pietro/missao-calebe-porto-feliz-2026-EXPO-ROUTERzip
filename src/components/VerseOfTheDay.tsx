import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius } from "../theme/spacing";
import { verseOfDayMock } from "../mocks/verse";

export const VerseOfTheDay: React.FC = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.wrapper, { marginHorizontal: spacing.lg }]}>
      <BlurView
        intensity={40}
        tint={isDark ? "dark" : "light"}
        style={[styles.card, { borderColor: theme.glassBorder }]}
      >
        <AppText variant="caption" color={theme.primary}>
          VERSÍCULO DO DIA
        </AppText>
        <AppText variant="h3" style={{ marginTop: spacing.xs }}>
          "{verseOfDayMock.text}"
        </AppText>
        <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xs }}>
          {verseOfDayMock.reference}
        </AppText>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: -spacing.xl,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    overflow: "hidden",
  },
});
