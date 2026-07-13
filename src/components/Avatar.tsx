import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { useAppTheme } from "../context/ThemeContext";
import { radius, shadow } from "../theme/spacing";

interface AvatarProps {
  uri: string;
  size?: number;
  borderColor?: string;
  style?: ViewStyle;
}

/**
 * Avatar circular reutilizável, com borda de destaque e sombra suave.
 * Usado no carrossel da Home, na lista de missionários, no detalhe e
 * no seletor de foto da edição de perfil.
 */
export const Avatar: React.FC<AvatarProps> = ({ uri, size = 88, borderColor, style }) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          borderColor: borderColor ?? theme.primary,
        },
        shadow.sm,
        style,
      ]}
    >
      <Image source={{ uri }} style={styles.image} contentFit="cover" transition={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    padding: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
});
