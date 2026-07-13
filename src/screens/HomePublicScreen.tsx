import React, { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../context/ThemeContext";
import { LoadingScreen } from "./LoadingScreen";
import {
  AnimatedHeader,
  ChurchCard,
  Footer,
  HeroBanner,
  MissionaryCarousel,
  PhotoCarousel,
  RevealOnMount,
  SectionTitle,
  VerseOfTheDay,
} from "../components";
import { AppText } from "../components/AppText";
import { spacing, radius, shadow } from "../theme/spacing";
import { MISSION } from "../constants";
import { churchesMock } from "../mocks/churches";

/**
 * Página inicial pública — acessível sem login. Apresenta a missão
 * para qualquer visitante que abrir o aplicativo.
 */
export const HomePublicScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const loadContent = useCallback(async () => {
    // Simula requisição inicial de dados (mock).
    await new Promise((resolve) => setTimeout(resolve, 900));
  }, []);

  useEffect(() => {
    loadContent().then(() => setIsLoading(false));
  }, [loadContent]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadContent();
    setIsRefreshing(false);
  }, [loadContent]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  if (isLoading) {
    return <LoadingScreen message="Carregando a missão..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AnimatedHeader scrollY={scrollY} title={MISSION.name} />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        <HeroBanner scrollY={scrollY} />

        <VerseOfTheDay />

        <RevealOnMount delay={80} style={{ marginTop: spacing.xl }}>
          <SectionTitle title="Sobre a missão" />
          <AppText
            variant="bodyLg"
            color={theme.textSecondary}
            style={{ paddingHorizontal: spacing.lg }}
          >
            A {MISSION.name} reúne jovens da {MISSION.church} para um mês inteiro de
            evangelismo, estudos bíblicos e serviço à comunidade de Porto Feliz, de
            01/07 a 01/08 de 2026.
          </AppText>
        </RevealOnMount>

        <RevealOnMount delay={140} style={{ marginTop: spacing.xl }}>
          <SectionTitle title="Registros da missão" />
          <PhotoCarousel />
        </RevealOnMount>

        <RevealOnMount delay={200} style={{ marginTop: spacing.xl }}>
          <SectionTitle title="Igrejas Adventistas" subtitle="Porto Feliz - SP" />
          {churchesMock.map((church) => (
            <ChurchCard key={church.id} church={church} />
          ))}
        </RevealOnMount>

        <RevealOnMount delay={260} style={{ marginTop: spacing.xl }}>
          <SectionTitle title="Missionários" />
          <MissionaryCarousel />
        </RevealOnMount>

        <Footer />
      </Animated.ScrollView>

      <Pressable
        onPress={() => router.push("/login")}
        style={[
          styles.accessButton,
          { top: insets.top + spacing.sm, backgroundColor: theme.surface },
          shadow.md,
        ]}
      >
        <AppText variant="caption" color={theme.secondary}>
          Área do Missionário
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accessButton: {
    position: "absolute",
    right: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    zIndex: 20,
  },
});
