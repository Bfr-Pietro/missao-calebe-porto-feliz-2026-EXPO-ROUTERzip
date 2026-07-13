import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme/spacing";
import { MISSION } from "../constants";
import { missionPhotosMock } from "../mocks/photos";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 380;

interface HeroBannerProps {
  scrollY: SharedValue<number>;
}

/**
 * Banner principal da Home pública, com efeito de parallax sutil na
 * imagem de fundo conforme o usuário rola a tela.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ scrollY }) => {
  const { theme } = useAppTheme();

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-BANNER_HEIGHT, 0, BANNER_HEIGHT], [-BANNER_HEIGHT / 2, 0, BANNER_HEIGHT * 0.4], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [-BANNER_HEIGHT, 0], [1.5, 1], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { scale }] };
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFillObject, imageStyle]}>
        <Image
          source={{ uri: missionPhotosMock[0] }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>
      <LinearGradient
        colors={["transparent", "rgba(7,26,44,0.75)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View style={styles.content}>
        <AppText variant="caption" color={theme.accent}>
          {MISSION.church}
        </AppText>
        <AppText variant="hero" color={theme.textInverse} style={{ marginTop: spacing.xxs }}>
          {MISSION.name}
        </AppText>
        <AppText variant="bodyLg" color={theme.textInverse} style={{ marginTop: spacing.xs, opacity: 0.9 }}>
          {MISSION.slogan}
        </AppText>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: BANNER_HEIGHT,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
