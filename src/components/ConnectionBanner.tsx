import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { useConnection } from "../context/ConnectionContext";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme/spacing";

const BAR_HEIGHT = 36;

/**
 * Banner fixo, exibido no topo de todo o app (montado em `RootNavigator`),
 * informando ausência de conexão. Some automaticamente com animação de
 * altura assim que a conectividade simulada volta. O indicador de
 * "Última sincronização" vive separadamente em `SyncStatusIndicator`
 * (visível mesmo quando online).
 */
export const ConnectionBanner: React.FC = () => {
  const { isOnline } = useConnection();
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOnline ? 0 : 1, { duration: 250 });
  }, [isOnline]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value * (BAR_HEIGHT + insets.top),
    paddingTop: progress.value * insets.top,
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.danger }, animatedStyle]}>
      <Icon name="cloud-offline-outline" size={14} color={theme.textInverse} style={{ marginRight: spacing.xxs }} />
      <AppText variant="caption" color={theme.textInverse}>
        Sem conexão — suas alterações continuam salvas neste dispositivo
      </AppText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    overflow: "hidden",
  },
});
