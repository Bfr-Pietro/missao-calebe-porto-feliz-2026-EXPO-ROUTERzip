import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { MapMarkerType } from "../types";
import { useAppTheme } from "../context/ThemeContext";
import { MAP_MARKER_META } from "../constants/mapMeta";
import { radius, shadow } from "../theme/spacing";

interface MapMarkerPinProps {
  type: MapMarkerType;
  size?: number;
}

/**
 * Pino customizado do Mapa Missionário: círculo colorido conforme o
 * tipo do marcador (status da família ou igreja), com ícone e borda
 * de contraste para boa legibilidade sobre o mapa.
 */
export const MapMarkerPin: React.FC<MapMarkerPinProps> = ({ type, size = 40 }) => {
  const { theme } = useAppTheme();
  const meta = MAP_MARKER_META[type];
  const color = theme[meta.colorKey];

  return (
    <View
      style={[
        shadow.sm,
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: color,
          borderWidth: 3,
          borderColor: theme.backgroundElevated,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Icon name={meta.icon} size={Math.round(size * 0.5)} color={theme.textInverse} />
    </View>
  );
};
