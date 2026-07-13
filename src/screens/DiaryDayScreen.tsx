import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "../components/AppText";
import { BottomSheet } from "../components/BottomSheet";
import { Button } from "../components/Button";
import { RevealOnMount } from "../components/RevealOnMount";
import { useAppTheme } from "../context/ThemeContext";
import { useDiary } from "../context/DiaryContext";
import { useSaveFeedback } from "../hooks";
import { radius, spacing } from "../theme/spacing";
import { formatDateTimePtBr, formatDatePtBr, getWeekdayLabel } from "../utils/dateUtils";

/**
 * Página de um único dia do Diário. Permite escrever, editar e
 * excluir o registro privado daquela data. A exclusão pede
 * confirmação em um Bottom Sheet antes de ser efetivada.
 */
export const DiaryDayScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ date: string }>();
  const { getEntry, saveEntry, deleteEntry } = useDiary();

  const existingEntry = getEntry(params.date);

  const [content, setContent] = useState(existingEntry?.content ?? "");
  const { isSaving, savedFeedback, runSave } = useSaveFeedback();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const hasChanges = content.trim() !== (existingEntry?.content ?? "").trim();

  const handleSave = async () => {
    if (!content.trim()) return;
    await runSave(async () => {
      await saveEntry(params.date, content.trim());
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEntry(params.date);
      setConfirmDeleteVisible(false);
      router.back();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.lg }}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ marginRight: spacing.sm }}>
            <Icon name="chevron-back" size={22} color={theme.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText variant="h1">{formatDatePtBr(params.date)}</AppText>
            <AppText variant="caption" color={theme.textSecondary} style={{ textTransform: "capitalize" }}>
              {getWeekdayLabel(params.date)}-feira
            </AppText>
          </View>
          {existingEntry ? (
            <Pressable onPress={() => setConfirmDeleteVisible(true)} hitSlop={12}>
              <Icon name="trash-outline" size={20} color={theme.danger} />
            </Pressable>
          ) : null}
        </View>

        <RevealOnMount>
          <View
            style={{
              borderRadius: radius.lg,
              borderWidth: 1.5,
              borderColor: theme.border,
              backgroundColor: theme.surface,
              padding: spacing.md,
              minHeight: 260,
            }}
          >
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Como foi o seu dia na missão? Registre visitas, aprendizados e orações respondidas..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              style={{ flex: 1, fontSize: 16, lineHeight: 24, color: theme.textPrimary }}
            />
          </View>
        </RevealOnMount>

        {existingEntry ? (
          <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: spacing.sm }}>
            Última edição: {formatDateTimePtBr(existingEntry.updatedAt)}
          </AppText>
        ) : null}

        <RevealOnMount delay={80} style={{ marginTop: spacing.lg }}>
          <Button
            label={savedFeedback ? "Salvo!" : isSaving ? "Salvando..." : "Salvar registro"}
            onPress={handleSave}
            disabled={!content.trim() || !hasChanges || isSaving}
          />
        </RevealOnMount>
      </ScrollView>

      <BottomSheet visible={confirmDeleteVisible} onClose={() => setConfirmDeleteVisible(false)}>
        <View style={{ paddingBottom: spacing.sm }}>
          <AppText variant="h3">Excluir registro?</AppText>
          <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}>
            O texto de {formatDatePtBr(params.date)} será apagado permanentemente.
          </AppText>
          <Button
            label={isDeleting ? "Excluindo..." : "Excluir"}
            onPress={handleConfirmDelete}
            disabled={isDeleting}
            variant="danger"
            style={{ marginBottom: spacing.sm }}
          />
          <Button label="Cancelar" variant="outline" onPress={() => setConfirmDeleteVisible(false)} />
        </View>
      </BottomSheet>
    </View>
  );
};
