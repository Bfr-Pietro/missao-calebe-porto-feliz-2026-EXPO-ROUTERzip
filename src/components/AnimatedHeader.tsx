import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme/spacing";

interface AnimatedHeaderProps {
  scrollY: SharedValue<number>;
  title: string;
  fadeStart?: number;
  fadeEnd?: number;
}

/**
 * Cabeçalho fixo que permanece transparente no topo da Home e ganha
 * fundo sólido + título assim que o usuário rola a tela, criando o
 * efeito "Animated Header" pedido no escopo.
 */
export const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  scrollY,
  title,
  fadeStart = 120,
  fadeEnd = 200,
}) => {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [fadeStart, fadeEnd], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      backgroundColor: theme.surface,
      borderBottomColor: theme.border,
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [fadeStart, fadeEnd], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { paddingTop: insets.top }, containerStyle]}
    >
      <Animated.View style={[styles.titleWrapper, titleStyle]}>
        <AppText variant="h3">{title}</AppText>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleWrapper: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
});
