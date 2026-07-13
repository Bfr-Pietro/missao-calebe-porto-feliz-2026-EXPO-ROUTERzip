import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Button } from "../components/Button";
import { TextField } from "../components/TextField";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { spacing, radius } from "../theme/spacing";
import { isValidEmail, isValidPassword } from "../utils/validation";

export const LoginScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shakeX = useSharedValue(0);

  const triggerShake = () => {
    shakeX.value = withTiming(10, { duration: 60, easing: Easing.linear }, () => {
      shakeX.value = withTiming(-10, { duration: 60 }, () => {
        shakeX.value = withTiming(0, { duration: 60 });
      });
    });
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const validate = (): boolean => {
    let valid = true;

    if (!isValidEmail(email)) {
      setEmailError("Informe um e-mail válido.");
      valid = false;
    } else {
      setEmailError(undefined);
    }

    if (!isValidPassword(password)) {
      setPasswordError("A senha deve ter ao menos 6 caracteres.");
      valid = false;
    } else {
      setPasswordError(undefined);
    }

    return valid;
  };

  const handleSubmit = async () => {
    setGeneralError(undefined);

    if (!validate()) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      // Ao autenticar, o RootNavigator troca automaticamente para a
      // árvore de navegação interna (InternalTabs) — nenhuma navegação
      // manual é necessária aqui.
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Não foi possível entrar.");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={[theme.primary, theme.background]} style={styles.header}>
        <View style={{ paddingTop: insets.top + spacing.xl, paddingHorizontal: spacing.lg }}>
          <View style={[styles.badge, { backgroundColor: theme.textInverse }]}>
            <AppText variant="h3" color={theme.secondary}>
              CALEBE
            </AppText>
          </View>
          <AppText variant="h1" color={theme.textInverse} style={{ marginTop: spacing.lg }}>
            Área do Missionário
          </AppText>
          <AppText variant="body" color={theme.textInverse} style={{ marginTop: spacing.xxs, opacity: 0.9 }}>
            Entre com seu e-mail e senha cadastrados.
          </AppText>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.form, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={shakeStyle}>
          <TextField
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            errorMessage={emailError}
          />
          <TextField
            label="Senha"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            errorMessage={passwordError}
          />

          {generalError ? (
            <View style={[styles.errorBox, { backgroundColor: theme.danger + "1A", borderColor: theme.danger }]}>
              <AppText variant="body" color={theme.danger}>
                {generalError}
              </AppText>
            </View>
          ) : null}

          <Button
            label={isSubmitting ? "Entrando..." : "Entrar"}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={{ marginTop: spacing.sm }}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.pill,
  },
  form: {
    flexGrow: 1,
    padding: spacing.lg,
    marginTop: -spacing.xl,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
});
