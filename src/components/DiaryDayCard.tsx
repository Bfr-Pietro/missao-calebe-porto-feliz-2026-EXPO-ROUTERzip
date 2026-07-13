import React from "react";
import { Pressable, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius } from "../theme/spacing";
import { formatDatePtBr, getWeekdayLabel, isToday } from "../utils/dateUtils";

interface DiaryDayCardProps {
  date: string;
  hasEntry: boolean;
  preview?: string;
  onPress: () => void;
}

/**
 * Item da lista do Diário: um card por dia, com data, dia da semana,
 * indicador visual de "escrito"/"em branco" e uma prévia do texto.
 */
export const DiaryDayCard: React.FC<DiaryDayCardProps> = ({ date, hasEntry, preview, onPress }) => {
  const { theme } = useAppTheme();
  const today = isToday(date);

  return (
    <Pressable onPress={onPress}>
      <Card
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: spacing.sm,
          borderColor: today ? theme.primary : theme.border,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: hasEntry ? theme.primary : theme.surfaceMuted,
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.md,
          }}
        >
          <AppText variant="h3" color={hasEntry ? theme.textInverse : theme.textSecondary}>
            {date.slice(8, 10)}
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText variant="h3">{formatDatePtBr(date)}</AppText>
            <AppText variant="caption" color={theme.textSecondary} style={{ marginLeft: spacing.xs, textTransform: "capitalize" }}>
              {getWeekdayLabel(date)}
            </AppText>
            {today ? (
              <View style={{ marginLeft: spacing.xs, backgroundColor: theme.accent, borderRadius: radius.pill, paddingHorizontal: spacing.xs }}>
                <AppText variant="caption" color={theme.textPrimary}>
                  Hoje
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText
            variant="body"
            color={hasEntry ? theme.textSecondary : theme.textSecondary}
            numberOfLines={1}
            style={{ marginTop: 2, opacity: hasEntry ? 1 : 0.7 }}
          >
            {hasEntry ? preview : "Toque para escrever"}
          </AppText>
        </View>

        <Icon
          name={hasEntry ? "checkmark-circle" : "chevron-forward"}
          size={20}
          color={hasEntry ? theme.success : theme.textSecondary}
        />
      </Card>
    </Pressable>
  );
};
