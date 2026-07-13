import { Stack } from "expo-router";

/**
 * Navegação da aba Perfil: resumo do próprio missionário e lista da
 * equipe. `EditProfile` foi movida para o grupo `(modals)`, pois é
 * apresentada como modal (slide de baixo para cima), assim como no
 * projeto original.
 */
export default function PerfilLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="missionary-list" />
    </Stack>
  );
}
