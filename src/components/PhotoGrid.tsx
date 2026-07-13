import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeIn } from "react-native-reanimated";
import Icon from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../context/ThemeContext";
import { radius, spacing } from "../theme/spacing";

interface PhotoGridProps {
  photos: string[];
  columns?: number;
  selectedUris?: string[];
  onToggle?: (uri: string) => void;
  emptyMessageSlot?: React.ReactNode;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

/**
 * Grade de fotos reutilizável.
 *
 * Modo visualização (padrão): exibe a galeria do missionário na tela
 * de detalhe, sem interação.
 * Modo seleção (`onToggle` informado): usada na edição de perfil para
 * escolher fotos de um pool mock, com indicador visual de selecionada.
 */
export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  columns = 3,
  selectedUris,
  onToggle,
  emptyMessageSlot,
}) => {
  const { theme } = useAppTheme();
  const gap = spacing.sm;
  const itemSize = (SCREEN_WIDTH - spacing.lg * 2 - gap * (columns - 1)) / columns;

  if (photos.length === 0 && emptyMessageSlot) {
    return <>{emptyMessageSlot}</>;
  }

  return (
    <View style={[styles.grid, { gap }]}>
      {photos.map((uri, index) => {
        const isSelected = selectedUris?.includes(uri);

        return (
          <Animated.View
            key={`${uri}-${index}`}
            entering={FadeIn.delay(index * 40).duration(300)}
            style={{ width: itemSize, height: itemSize }}
          >
            <Pressable
              style={styles.itemFill}
              onPress={onToggle ? () => onToggle(uri) : undefined}
            >
              <Image source={{ uri }} style={styles.image} contentFit="cover" transition={200} />
              {onToggle ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isSelected ? theme.primary : "rgba(0,0,0,0.35)",
                      borderColor: "#FFFFFF",
                    },
                  ]}
                >
                  <Icon name={isSelected ? "checkmark" : "add"} size={14} color="#FFFFFF" />
                </View>
              ) : null}
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
  },
  itemFill: {
    flex: 1,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
