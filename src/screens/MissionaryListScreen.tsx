import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "../components/AppText";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { RevealOnMount } from "../components/RevealOnMount";
import { useAppTheme } from "../context/ThemeContext";
import { useMissionaries } from "../context/MissionaryContext";
import { spacing } from "../theme/spacing";
import { Missionary } from "../types";

/**
 * Lista completa dos missionários da equipe (Etapa 4), acessível a
 * partir da aba Perfil. Cada item navega até `MissionaryDetail`,
 * compartilhada com a Home pública.
 */
export const MissionaryListScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { missionaries } = useMissionaries();

  const renderItem = ({ item, index }: { item: Missionary; index: number }) => (
    <RevealOnMount delay={index * 60} translateY={16}>
      <Pressable
        onPress={() => router.push(`/missionary/${item.id}`)}
      >
        <Card style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.md }}>
          <Avatar uri={item.photoUrl} size={56} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <AppText variant="h3">{item.name}</AppText>
            <AppText variant="caption" color={theme.textSecondary}>
              {item.city} • {item.age} anos
            </AppText>
          </View>
          <Icon name="chevron-forward" size={20} color={theme.textSecondary} />
        </Card>
      </Pressable>
    </RevealOnMount>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.sm }}>
        <AppText variant="h1">Equipe missionária</AppText>
        <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xxs }}>
          Toque em um missionário para ver o perfil completo.
        </AppText>
      </View>

      <FlatList
        data={missionaries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
