import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/Ionicons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../components/AppText";
import { BottomSheet } from "../components/BottomSheet";
import { MapLegend } from "../components/MapLegend";
import { MapMarkerPin } from "../components/MapMarkerPin";
import { MapMarkerDetailContent } from "../components/MapMarkerDetailContent";
import { MapCreateMarkerForm } from "../components/MapCreateMarkerForm";
import { LoadingScreen } from "./LoadingScreen";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useMapMarkers } from "../context/MapContext";
import { FamilyStatus, MapMarkerType } from "../types";
import { MAP_INITIAL_REGION } from "../constants";
import { radius, shadow, spacing } from "../theme/spacing";

/**
 * Mapa Missionário — Etapa 5.
 *
 * Exibe todos os marcadores (famílias + igrejas) sobre o mapa de
 * Porto Feliz. Tocar em um marcador abre um Bottom Sheet moderno com
 * um botão individual para cada status (conforme escopo). Apenas o
 * administrador pode criar novos marcadores: ao ativar o FAB, o
 * próximo toque no mapa define a localização e abre o formulário de
 * criação em outro Bottom Sheet.
 */
export const MapScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { isAdmin } = useAuth();
  const insets = useSafeAreaInsets();
  const { markers, isLoading, updateStatus, createMarker } = useMapMarkers();

  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [pendingCoordinate, setPendingCoordinate] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSavingMarker, setIsSavingMarker] = useState(false);

  const fabScale = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  if (isLoading) {
    return <LoadingScreen message="Carregando mapa missionário..." />;
  }

  const selectedMarker = markers.find((item) => item.id === selectedMarkerId) ?? null;

  const closeDetailSheet = () => setSelectedMarkerId(null);

  const handleChangeStatus = async (status: FamilyStatus) => {
    if (!selectedMarker) return;
    setIsUpdatingStatus(true);
    try {
      await updateStatus(selectedMarker.id, status as MapMarkerType);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    if (!isPlacingMarker) return;
    setPendingCoordinate(event.nativeEvent.coordinate);
    setIsPlacingMarker(false);
  };

  const handleToggleAddMode = () => {
    fabScale.value = withSpring(0.88, { damping: 12 }, () => {
      fabScale.value = withSpring(1, { damping: 12 });
    });
    setIsPlacingMarker((prev) => !prev);
  };

  const handleCreateMarker = async (data: {
    type: MapMarkerType;
    familyName: string;
    address: string;
    notes?: string;
  }) => {
    if (!pendingCoordinate) return;
    setIsSavingMarker(true);
    try {
      await createMarker({ ...data, ...pendingCoordinate });
      setPendingCoordinate(null);
    } finally {
      setIsSavingMarker(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={MAP_INITIAL_REGION}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => setSelectedMarkerId(marker.id)}
            tracksViewChanges={false}
          >
            <MapMarkerPin type={marker.type} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.headerRow, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        <BlurView
          intensity={60}
          tint={isDark ? "dark" : "light"}
          style={[
            shadow.md,
            styles.titlePill,
            { borderColor: theme.glassBorder, backgroundColor: theme.glassBackground },
          ]}
        >
          <Icon name="map" size={16} color={theme.primary} style={{ marginRight: spacing.xxs }} />
          <AppText variant="caption" color={theme.textPrimary}>
            Mapa Missionário
          </AppText>
        </BlurView>

        <View style={{ width: 150 }}>
          <MapLegend />
        </View>
      </View>

      {isPlacingMarker ? (
        <View style={[styles.hintWrapper, { top: insets.top + spacing.xxl + spacing.md }]} pointerEvents="none">
          <BlurView
            intensity={70}
            tint={isDark ? "dark" : "light"}
            style={[
              shadow.md,
              styles.hintPill,
              { borderColor: theme.glassBorder, backgroundColor: theme.glassBackground },
            ]}
          >
            <Icon name="finger-print-outline" size={16} color={theme.accent} style={{ marginRight: spacing.xs }} />
            <AppText variant="caption" color={theme.textPrimary}>
              Toque no mapa para posicionar o marcador
            </AppText>
          </BlurView>
        </View>
      ) : null}

      {isAdmin ? (
        <Animated.View
          style={[
            fabAnimatedStyle,
            styles.fab,
            shadow.lg,
            {
              bottom: insets.bottom + spacing.xxxl + spacing.lg,
              backgroundColor: isPlacingMarker ? theme.danger : theme.primary,
            },
          ]}
        >
          <Pressable onPress={handleToggleAddMode} style={styles.fabPressable}>
            <Icon name={isPlacingMarker ? "close" : "add"} size={26} color={theme.textInverse} />
          </Pressable>
        </Animated.View>
      ) : null}

      <BottomSheet visible={!!selectedMarker} onClose={closeDetailSheet}>
        {selectedMarker ? (
          <MapMarkerDetailContent
            marker={selectedMarker}
            onChangeStatus={handleChangeStatus}
            isUpdating={isUpdatingStatus}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet visible={!!pendingCoordinate} onClose={() => setPendingCoordinate(null)}>
        {pendingCoordinate ? (
          <MapCreateMarkerForm
            coordinate={pendingCoordinate}
            onSubmit={handleCreateMarker}
            isSaving={isSavingMarker}
          />
        ) : null}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titlePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
  hintWrapper: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    alignItems: "center",
  },
  hintPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
  fabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
