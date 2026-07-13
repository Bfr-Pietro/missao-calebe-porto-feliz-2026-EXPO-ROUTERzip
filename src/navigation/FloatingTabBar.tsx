import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Icon from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { AppText } from "../components/AppText";
import { useAppTheme } from "../context/ThemeContext";
import { radius, spacing, shadow } from "../theme/spacing";

type IconName = ComponentProps<typeof Icon>["name"];

const ICONS: Record<string, IconName> = {
  perfil: "person-circle-outline",
  mapa: "map-outline",
  diario: "book-outline",
};

const LABELS: Record<string, string> = {
  perfil: "Perfil",
  mapa: "Mapa",
  diario: "Diário",
};

const TabItem: React.FC<{
  focused: boolean;
  icon: IconName;
  label: string;
  onPress: () => void;
}> = ({ focused, icon, label, onPress }) => {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.9, { damping: 14 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 10 }))}
      style={styles.item}
    >
      <Animated.View style={[styles.itemInner, animatedStyle]}>
        <View
          style={[
            styles.iconWrapper,
            focused && { backgroundColor: theme.primary },
          ]}
        >
          <Icon name={icon} size={20} color={focused ? theme.textInverse : theme.textSecondary} />
        </View>
        <AppText
          variant="caption"
          color={focused ? theme.primary : theme.textSecondary}
          style={{ marginTop: 2 }}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
};

/**
 * Barra de abas flutuante com efeito de vidro (glassmorphism), usada
 * pela Área Interna. Substitui a tab bar padrão para manter a
 * identidade visual "premium" definida no escopo.
 */
export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.md }]} pointerEvents="box-none">
      <BlurView
        intensity={60}
        tint={isDark ? "dark" : "light"}
        style={[
          styles.bar,
          { borderColor: theme.glassBorder, backgroundColor: theme.glassBackground },
          shadow.lg,
        ]}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              focused={focused}
              icon={ICONS[route.name] ?? "ellipse-outline"}
              label={LABELS[route.name] ?? route.name}
              onPress={onPress}
            />
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    width: "100%",
    justifyContent: "space-around",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxs,
  },
  itemInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
