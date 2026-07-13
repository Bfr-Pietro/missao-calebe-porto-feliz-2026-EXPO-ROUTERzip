import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { MAP_MARKER_META } from "../constants/mapMeta";
import { MapMarkerType } from "../types";
import { radius, shadow, spacing } from "../theme/spacing";

const LEGEND_ORDER: MapMarkerType[] = ["visitar", "retornar", "rejeitou", "finalizado", "igreja"];

/**
 * Legenda flutuante em glassmorphism, explicando a cor de cada tipo
 * de marcador. Pode ser recolhida para não ocupar espaço do mapa.
 */
export const MapLegend: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const [expanded, setExpanded] = useState(true);
  const rotation = useSharedValue(0);

  const toggle = () => {
    setExpanded((prev) => !prev);
    rotation.value = withTiming(expanded ? 0 : 1, { duration: 220 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <BlurView
      intensity={60}
      tint={isDark ? "dark" : "light"}
      style={[
        shadow.md,
        {
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: theme.glassBorder,
          backgroundColor: theme.glassBackground,
          overflow: "hidden",
        },
      ]}
    >
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
        }}
      >
        <AppText variant="caption" color={theme.textPrimary}>
          Legenda
        </AppText>
        <Animated.View style={chevronStyle}>
          <Icon name="chevron-down" size={14} color={theme.textSecondary} />
        </Animated.View>
      </Pressable>

      {expanded ? (
        <View style={{ paddingHorizontal: spacing.sm, paddingBottom: spacing.sm }}>
          {LEGEND_ORDER.map((type) => {
            const meta = MAP_MARKER_META[type];
            return (
              <View
                key={type}
                style={{ flexDirection: "row", alignItems: "center", marginTop: spacing.xxs }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: radius.pill,
                    backgroundColor: theme[meta.colorKey],
                    marginRight: spacing.xs,
                  }}
                />
                <AppText variant="caption" color={theme.textSecondary}>
                  {meta.shortLabel}
                </AppText>
              </View>
            );
          })}
        </View>
      ) : null}
    </BlurView>
  );
};
