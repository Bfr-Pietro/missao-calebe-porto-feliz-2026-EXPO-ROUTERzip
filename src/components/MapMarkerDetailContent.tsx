import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { AppText } from "./AppText";
import { MarkerTypeChip } from "./MarkerTypeChip";
import { useAppTheme } from "../context/ThemeContext";
import { FamilyStatus, MapMarkerData } from "../types";
import { FAMILY_STATUS_ORDER, MAP_MARKER_META } from "../constants/mapMeta";
import { radius, spacing } from "../theme/spacing";

interface MapMarkerDetailContentProps {
  marker: MapMarkerData;
  onChangeStatus: (status: FamilyStatus) => void;
  isUpdating: boolean;
}

/**
 * Conteúdo do Bottom Sheet exibido ao tocar em um marcador do mapa.
 * Para marcadores de família, exibe um botão individual para cada um
 * dos 4 status (conforme exigido no escopo — nunca um seletor único).
 * Marcadores de igreja exibem apenas as informações, sem ações de
 * status.
 */
export const MapMarkerDetailContent: React.FC<MapMarkerDetailContentProps> = ({
  marker,
  onChangeStatus,
  isUpdating,
}) => {
  const { theme } = useAppTheme();
  const meta = MAP_MARKER_META[marker.type];
  const isFamily = marker.type !== "igreja";

  return (
    <View style={{ paddingBottom: spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.pill,
            backgroundColor: theme[meta.colorKey],
            alignItems: "center",
            justifyContent: "center",
            marginRight: spacing.sm,
          }}
        >
          <Icon name={meta.icon} size={20} color={theme.textInverse} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">{marker.familyName}</AppText>
          <AppText variant="caption" color={theme[meta.colorKey]} style={{ marginTop: 2 }}>
            {meta.label}
          </AppText>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: spacing.md }}>
        <Icon name="location-outline" size={16} color={theme.textSecondary} style={{ marginTop: 2, marginRight: spacing.xs }} />
        <AppText variant="body" color={theme.textSecondary} style={{ flex: 1 }}>
          {marker.address}
        </AppText>
      </View>

      {marker.notes ? (
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: spacing.xs }}>
          <Icon name="document-text-outline" size={16} color={theme.textSecondary} style={{ marginTop: 2, marginRight: spacing.xs }} />
          <AppText variant="body" color={theme.textSecondary} style={{ flex: 1 }}>
            {marker.notes}
          </AppText>
        </View>
      ) : null}

      {isFamily ? (
        <>
          <AppText variant="caption" color={theme.textSecondary} style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>
            Alterar status da família
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {FAMILY_STATUS_ORDER.map((status) => (
              <MarkerTypeChip
                key={status}
                type={status}
                active={marker.type === status}
                disabled={isUpdating}
                onPress={() => onChangeStatus(status)}
                height={48}
                style={{ width: "48%", marginBottom: spacing.sm }}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};
