import React from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { DiaryDayCard } from "../components/DiaryDayCard";
import { RevealOnMount } from "../components/RevealOnMount";
import { LoadingScreen } from "./LoadingScreen";
import { useAppTheme } from "../context/ThemeContext";
import { useDiary } from "../context/DiaryContext";
import { spacing } from "../theme/spacing";
import { getDiaryDateRange } from "../utils/dateUtils";

const DIARY_DATES = getDiaryDateRange();

/**
 * Diário — Etapa 6. Lista uma página por dia da missão (01/07 a
 * 01/08/2026), cada uma privada ao missionário autenticado. Toca em
 * um dia para escrever, editar ou excluir o registro daquela data.
 */
export const DiaryScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { entriesByDate, isLoading } = useDiary();

  if (isLoading) {
    return <LoadingScreen message="Carregando seu diário..." />;
  }

  const writtenCount = Object.keys(entriesByDate).length;

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const entry = entriesByDate[item];
    return (
      <RevealOnMount delay={Math.min(index * 25, 300)} translateY={14}>
        <DiaryDayCard
          date={item}
          hasEntry={!!entry}
          preview={entry?.content}
          onPress={() => router.push(`/diario/${item}`)}
        />
      </RevealOnMount>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.sm }}>
        <AppText variant="h1">Diário</AppText>
        <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xxs }}>
          Registros privados — só você pode ver o que escrever aqui.
        </AppText>
        <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: spacing.xxs }}>
          {writtenCount} de {DIARY_DATES.length} dias escritos
        </AppText>
      </View>

      <FlatList
        data={DIARY_DATES}
        keyExtractor={(date) => date}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
