import React from "react";
import { Dimensions, FlatList, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { radius, spacing } from "../theme/spacing";
import { missionPhotosMock } from "../mocks/photos";

const ITEM_WIDTH = Dimensions.get("window").width * 0.72;
const ITEM_HEIGHT = 200;

export const PhotoCarousel: React.FC = () => {
  return (
    <FlatList
      data={missionPhotosMock}
      keyExtractor={(item, index) => `${item}-${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH + spacing.md}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
      renderItem={({ item }) => (
        <Pressable style={styles.item}>
          <Image source={{ uri: item }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={200} />
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
});
