import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { MapMarkerType } from "../types";
import { MAP_MARKER_META } from "../constants/mapMeta";
import { radius, spacing } from "../theme/spacing";
import { pressAnimationConfig } from "../animations/transitions";

interface MarkerTypeChipProps {
  type: MapMarkerType;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  pill?: boolean;
  style?: ViewStyle;
}

/**
 * Chip colorido (ícone + rótulo curto) reutilizado em duas situações
 * do Mapa Missionário: os botões de status no Bottom Sheet de detalhe
 * (`MapMarkerDetailContent`) e o seletor de tipo no formulário de
 * criação de marcador (`MapCreateMarkerForm`). Centraliza a cor por
 * tipo (`MAP_MARKER_META`) e a microinteração de escala ao toque.
 */
export const MarkerTypeChip: React.FC<MarkerTypeChipProps> = ({
  type,
  active,
  onPress,
  disabled,
  height = 40,
  pill = false,
  style,
}) => {
  const { theme } = useAppTheme();
  const meta = MAP_MARKER_META[type];
  const color = theme[meta.colorKey];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={() =>
          (scale.value = withTiming(pressAnimationConfig.scaleDown, { duration: pressAnimationConfig.duration }))
        }
        onPressOut={() => (scale.value = withTiming(1, { duration: pressAnimationConfig.duration }))}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height,
          borderRadius: pill ? radius.pill : radius.md,
          borderWidth: 1.5,
          borderColor: color,
          backgroundColor: active ? color : "transparent",
          paddingHorizontal: spacing.sm,
          opacity: disabled && !active ? 0.5 : 1,
        }}
      >
        <Icon name={meta.icon} size={14} color={active ? theme.textInverse : color} style={{ marginRight: spacing.xxs }} />
        <AppText variant="caption" color={active ? theme.textInverse : color} numberOfLines={1}>
          {meta.shortLabel}
        </AppText>
      </Pressable>
    </Animated.View>
  );
};
