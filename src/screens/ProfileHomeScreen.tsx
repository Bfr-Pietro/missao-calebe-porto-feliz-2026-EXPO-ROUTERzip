import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ConnectionStatusCard } from "../components/ConnectionStatusCard";
import { RevealOnMount } from "../components/RevealOnMount";
import { LoadingScreen } from "./LoadingScreen";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useMissionaries } from "../context/MissionaryContext";
import { palette } from "../theme/colors";
import { spacing, radius } from "../theme/spacing";

/**
 * Tela inicial da aba Perfil: resumo do próprio missionário logado,
 * com atalhos para editar o perfil e ver a equipe completa, além do
 * botão de sair (movido da antiga AreaInternaScreen provisória).
 */
export const ProfileHomeScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const { getById, isLoading } = useMissionaries();

  const missionary = user ? getById(user.id) : undefined;

  if (isLoading || !missionary) {
    return <LoadingScreen message="Carregando perfil..." />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      <AppText variant="h1">Meu perfil</AppText>
      <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xxs, marginBottom: spacing.lg }}>
        Suas informações também aparecem na página pública da missão.
      </AppText>

      <RevealOnMount>
        <Card style={{ alignItems: "center", paddingVertical: spacing.lg }}>
          <Avatar uri={missionary.photoUrl} size={96} />
          <AppText variant="h2" style={{ marginTop: spacing.sm }}>
            {missionary.name}
          </AppText>
          <AppText variant="body" color={theme.textSecondary}>
            {missionary.city} • {missionary.age} anos
          </AppText>
          {isAdmin ? (
            <View style={{ marginTop: spacing.sm, backgroundColor: theme.accent, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 }}>
              <AppText variant="caption" color={palette.navy900}>
                ADMINISTRADOR
              </AppText>
            </View>
          ) : null}
        </Card>
      </RevealOnMount>

      <RevealOnMount delay={80} style={{ marginTop: spacing.lg }}>
        <Button
          label="Editar perfil"
          onPress={() => router.push("/edit-profile")}
        />
      </RevealOnMount>

      <RevealOnMount delay={140} style={{ marginTop: spacing.md }}>
        <Button
          label="Ver equipe missionária"
          variant="secondary"
          onPress={() => router.push("/perfil/missionary-list")}
        />
      </RevealOnMount>

      <RevealOnMount delay={200} style={{ marginTop: spacing.xl }}>
        <ConnectionStatusCard />
      </RevealOnMount>

      <RevealOnMount delay={260} style={{ marginTop: spacing.lg, marginBottom: spacing.xl }}>
        <Button label="Sair" variant="outline" onPress={signOut} />
      </RevealOnMount>
    </ScrollView>
  );
};
