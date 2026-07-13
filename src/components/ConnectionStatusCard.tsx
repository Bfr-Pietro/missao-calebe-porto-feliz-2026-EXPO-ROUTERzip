import React, { useState } from "react";
import { Pressable, Switch, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { useAppTheme } from "../context/ThemeContext";
import { useConnection } from "../context/ConnectionContext";
import { spacing, radius } from "../theme/spacing";
import { formatDateTimePtBr } from "../utils/dateUtils";

/**
 * Card de status de conectividade: mostra se o app está online ou
 * offline (simulado), a data/hora da última sincronização com um
 * botão para sincronizar manualmente, e um alternador para simular o
 * modo offline — útil para testar o `ConnectionBanner` nesta fase em
 * que a persistência ainda é mock (sem NetInfo real).
 */
export const ConnectionStatusCard: React.FC = () => {
  const { theme } = useAppTheme();
  const { isOnline, lastSyncedAt, setOnlineStatus, syncNow } = useConnection();
  const [isSyncing, setIsSyncing] = useState(false);
  const rotation = useSharedValue(0);

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    rotation.value = withRepeat(withTiming(360, { duration: 700 }), -1, false);
    await syncNow();
    rotation.value = withTiming(0, { duration: 150 });
    setIsSyncing(false);
  };

  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Card>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Icon
          name={isOnline ? "cloud-done-outline" : "cloud-offline-outline"}
          size={20}
          color={isOnline ? theme.success : theme.danger}
          style={{ marginRight: spacing.xs }}
        />
        <AppText variant="h3" color={isOnline ? theme.success : theme.danger}>
          {isOnline ? "Conectado" : "Offline"}
        </AppText>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm }}>
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <AppText variant="caption" color={theme.textSecondary}>
            Última sincronização
          </AppText>
          <AppText variant="body">
            {lastSyncedAt ? formatDateTimePtBr(lastSyncedAt) : "Ainda não sincronizado"}
          </AppText>
        </View>
        <Pressable
          onPress={handleSync}
          disabled={!isOnline || isSyncing}
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.pill,
            backgroundColor: theme.surfaceMuted,
            alignItems: "center",
            justifyContent: "center",
            opacity: !isOnline ? 0.5 : 1,
          }}
        >
          <Animated.View style={spinStyle}>
            <Icon name="refresh-outline" size={18} color={theme.primary} />
          </Animated.View>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: spacing.md,
          paddingTop: spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.divider,
        }}
      >
        <View style={{ flex: 1, marginRight: spacing.sm }}>
          <AppText variant="body">Simular modo offline</AppText>
          <AppText variant="caption" color={theme.textSecondary}>
            Para testar o app sem conexão (uso interno)
          </AppText>
        </View>
        <Switch
          value={!isOnline}
          onValueChange={(simulateOffline) => setOnlineStatus(!simulateOffline)}
          trackColor={{ false: theme.border, true: theme.danger }}
          thumbColor={theme.backgroundElevated}
        />
      </View>
    </Card>
  );
};
