import { Stack } from "expo-router";

/**
 * Grupo de rotas modais, apresentadas por cima da navegação principal
 * (o root Stack aplica `presentation: "modal"` a este grupo inteiro).
 * Substitui a animação `slide_from_bottom` usada antes em `EditProfile`
 * dentro do `ProfileStackNavigator` — mesma sensação de "folha subindo
 * de baixo para cima", agora usando o padrão nativo de modal do Expo
 * Router.
 */
export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_bottom" }}>
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
