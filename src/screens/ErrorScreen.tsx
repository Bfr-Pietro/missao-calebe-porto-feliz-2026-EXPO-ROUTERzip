import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { useAppTheme } from "../context/ThemeContext";
import { spacing } from "../theme/spacing";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = "Algo deu errado",
  message = "Não foi possível carregar o conteúdo. Tente novamente.",
  onRetry,
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppText variant="h2" center>
        {title}
      </AppText>
      <AppText
        variant="body"
        color={theme.textSecondary}
        center
        style={{ marginTop: spacing.xs, marginBottom: spacing.lg }}
      >
        {message}
      </AppText>
      {onRetry ? <Button label="Tentar novamente" onPress={onRetry} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
});
