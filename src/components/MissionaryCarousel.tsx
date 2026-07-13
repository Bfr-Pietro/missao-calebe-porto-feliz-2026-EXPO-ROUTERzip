import React from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "./AppText";
import { Avatar } from "./Avatar";
import { useAppTheme } from "../context/ThemeContext";
import { useMissionaries } from "../context/MissionaryContext";
import { spacing } from "../theme/spacing";
import { Missionary } from "../types";

const AVATAR_SIZE = 88;

export const MissionaryCarousel: React.FC = () => {
  const { theme } = useAppTheme();
  const { missionaries } = useMissionaries();
  const router = useRouter();

  const renderItem = ({ item }: { item: Missionary }) => (
    <Pressable
      style={styles.item}
      onPress={() => router.push(`/missionary/${item.id}`)}
    >
      <Avatar uri={item.photoUrl} size={AVATAR_SIZE} />
      <AppText variant="body" center style={{ marginTop: spacing.xs, width: AVATAR_SIZE + 16 }} numberOfLines={1}>
        {item.name}
      </AppText>
      <AppText variant="caption" color={theme.textSecondary} center numberOfLines={1}>
        {item.city}
      </AppText>
    </Pressable>
  );

  return (
    <FlatList
      data={missionaries}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    width: AVATAR_SIZE + 16,
  },
});
