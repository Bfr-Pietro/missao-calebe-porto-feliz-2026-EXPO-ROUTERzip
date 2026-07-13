import { Stack } from "expo-router";

/**
 * Navegação do visitante (não autenticado): Home pública → Login.
 * Equivalente ao ramo `HomePublic`/`Login` do antigo `RootNavigator`.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
}
