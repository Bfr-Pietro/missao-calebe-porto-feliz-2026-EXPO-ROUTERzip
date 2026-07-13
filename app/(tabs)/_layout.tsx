import { Tabs } from "expo-router";
import { FloatingTabBar } from "../../src/navigation/FloatingTabBar";

/**
 * Navegação interna (pós-login), em abas flutuantes com glassmorphism.
 * Usa a mesma `FloatingTabBar` customizada do projeto original —
 * nenhuma mudança visual ou de comportamento.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
      <Tabs.Screen name="mapa" options={{ title: "Mapa" }} />
      <Tabs.Screen name="diario" options={{ title: "Diário" }} />
    </Tabs>
  );
}
