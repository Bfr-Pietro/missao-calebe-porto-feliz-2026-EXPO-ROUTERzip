import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { easings } from "../animations/transitions";

interface RevealOnMountProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
  translateY?: number;
}

/**
 * Componente genérico de "Scroll Reveal": anima fade + slide-up quando
 * é montado na tela (ex: ao entrar em viewport dentro de uma FlatList
 * ou ao montar uma seção da Home). Aceita um `delay` para criar efeito
 * de entrada escalonada entre elementos de uma lista.
 */
export const RevealOnMount: React.FC<RevealOnMountProps> = ({
  children,
  delay = 0,
  style,
  translateY = 24,
}) => {
  const opacity = useSharedValue(0);
  const translateYValue = useSharedValue(translateY);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 450, easing: easings.decelerate }));
    translateYValue.value = withDelay(delay, withTiming(0, { duration: 450, easing: easings.decelerate }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateYValue.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
};
