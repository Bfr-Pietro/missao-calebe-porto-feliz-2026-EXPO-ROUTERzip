import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { AppText } from "../components/AppText";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { PhotoGrid } from "../components/PhotoGrid";
import { RevealOnMount } from "../components/RevealOnMount";
import { SectionTitle } from "../components/SectionTitle";
import { useAppTheme } from "../context/ThemeContext";
import { palette } from "../theme/colors";
import { useMissionaries } from "../context/MissionaryContext";
import { spacing, radius, shadow } from "../theme/spacing";

const BANNER_HEIGHT = 260;

type IconName = ComponentProps<typeof Icon>["name"];

const socialItems: Array<{ key: "instagram" | "whatsapp" | "facebook"; icon: IconName; label: string }> = [
  { key: "instagram", icon: "logo-instagram", label: "Instagram" },
  { key: "whatsapp", icon: "logo-whatsapp", label: "WhatsApp" },
  { key: "facebook", icon: "logo-facebook", label: "Facebook" },
];

/**
 * Tela de detalhe de um missionário, compartilhada entre a Home
 * pública (via carrossel) e a Área Interna (via lista de
 * missionários). Somente leitura — a edição do próprio perfil
 * acontece em `EditProfileScreen`, dentro da Área Interna.
 */
export const MissionaryDetailScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ missionaryId: string }>();
  const { getById, isLoading } = useMissionaries();

  const missionary = getById(params.missionaryId);

  const openSocial = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => undefined);
  };

  if (!missionary) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <AppText variant="body" color={theme.textSecondary}>
          {isLoading ? "Carregando..." : "Missionário não encontrado."}
        </AppText>
      </View>
    );
  }

  const availableSocials = socialItems.filter((item) => missionary.social[item.key]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.bannerWrapper}>
          <Image source={{ uri: missionary.photoUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <LinearGradient
            colors={["rgba(0,0,0,0.05)", theme.background]}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: -56 }}>
          <RevealOnMount>
            <Card style={{ alignItems: "center", paddingVertical: spacing.lg }}>
              <Avatar uri={missionary.photoUrl} size={104} borderColor={theme.surface} />
              <AppText variant="h1" center style={{ marginTop: spacing.sm }}>
                {missionary.name}
              </AppText>
              <View style={styles.metaRow}>
                <Icon name="location-outline" size={14} color={theme.textSecondary} />
                <AppText variant="body" color={theme.textSecondary} style={{ marginLeft: 4 }}>
                  {missionary.city}
                </AppText>
                <AppText variant="body" color={theme.textSecondary} style={{ marginHorizontal: 6 }}>
                  •
                </AppText>
                <AppText variant="body" color={theme.textSecondary}>
                  {missionary.age} anos
                </AppText>
              </View>

              {missionary.role === "admin" ? (
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                  <AppText variant="caption" color={palette.navy900}>
                    ADMINISTRADOR
                  </AppText>
                </View>
              ) : null}

              {availableSocials.length > 0 ? (
                <View style={styles.socialRow}>
                  {availableSocials.map((item) => (
                    <Pressable
                      key={item.key}
                      onPress={() => openSocial(missionary.social[item.key])}
                      style={[styles.socialButton, { backgroundColor: theme.surfaceMuted }]}
                    >
                      <Icon name={item.icon} size={20} color={theme.secondary} />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </Card>
          </RevealOnMount>

          {missionary.bio ? (
            <RevealOnMount delay={80} style={{ marginTop: spacing.xl }}>
              <SectionTitle title="Sobre" />
              <AppText variant="bodyLg" color={theme.textSecondary}>
                {missionary.bio}
              </AppText>
            </RevealOnMount>
          ) : null}

          <RevealOnMount delay={140} style={{ marginTop: spacing.xl, marginBottom: spacing.xxl }}>
            <SectionTitle title="Galeria de fotos" />
          </RevealOnMount>
        </View>

        <PhotoGrid
          photos={missionary.gallery}
          emptyMessageSlot={
            <AppText
              variant="body"
              color={theme.textSecondary}
              style={{ paddingHorizontal: spacing.lg, marginTop: -spacing.lg, marginBottom: spacing.xxl }}
            >
              Nenhuma foto na galeria ainda.
            </AppText>
          }
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <Pressable
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top + spacing.sm, backgroundColor: theme.surface }, shadow.md]}
      >
        <Icon name="chevron-back" size={20} color={theme.textPrimary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerWrapper: {
    height: BANNER_HEIGHT,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xxs,
  },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
