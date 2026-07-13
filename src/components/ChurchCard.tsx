import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Card } from "./Card";
import { AppText } from "./AppText";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius } from "../theme/spacing";
import { Church } from "../types";

interface ChurchCardProps {
  church: Church;
}

export const ChurchCard: React.FC<ChurchCardProps> = ({ church }) => {
  const { theme } = useAppTheme();

  return (
    <Card padded={false} style={styles.card}>
      <Image source={{ uri: church.photoUrl }} style={styles.photo} contentFit="cover" transition={200} />
      <View style={{ padding: spacing.md }}>
        <AppText variant="h3">{church.name}</AppText>
        <AppText variant="body" color={theme.textSecondary} style={{ marginTop: spacing.xxs }}>
          {church.address}
        </AppText>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
});
