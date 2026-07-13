import { Stack } from "expo-router";

/**
 * Navegação da aba Diário: lista de dias da missão e a página de
 * escrita/edição de um dia específico.
 */
export default function DiarioLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[date]" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
