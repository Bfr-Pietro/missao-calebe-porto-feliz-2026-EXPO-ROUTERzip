import { Easing } from "react-native-reanimated";
import { ANIMATION_DURATION } from "../constants";

/**
 * Presets de animação compartilhados para manter consistência visual
 * em todo o aplicativo (fade, scale, slide, etc.), usados com
 * react-native-reanimated nos componentes e telas.
 */

export const easings = {
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),
};

export const fadeInConfig = {
  duration: ANIMATION_DURATION.normal,
  easing: easings.decelerate,
};

export const scaleInConfig = {
  duration: ANIMATION_DURATION.fast,
  easing: easings.standard,
};

export const pressAnimationConfig = {
  scaleDown: 0.96,
  duration: ANIMATION_DURATION.fast,
};

export const slideUpConfig = {
  duration: ANIMATION_DURATION.slow,
  easing: easings.decelerate,
};
