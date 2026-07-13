import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "../src/context/ThemeContext";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { ConnectionProvider } from "../src/context/ConnectionContext";
import { MissionaryProvider } from "../src/context/MissionaryContext";
import { MapProvider } from "../src/context/MapContext";
import { DiaryProvider } from "../src/context/DiaryContext";
import { SplashScreen } from "../src/screens/SplashScreen";
import { LoadingScreen } from "../src/screens/LoadingScreen";
import { ErrorScreen } from "../src/screens/ErrorScreen";
import { ConnectionBanner } from "../src/components/ConnectionBanner";

/**
 * Layout raiz do aplicativo (Expo Router).
 *
 * Equivalente ao antigo `App.tsx` + `RootNavigator`: monta todos os
 * Providers globais (tema, conexão, autenticação, missionários, mapa,
 * diário), exibe a Splash animada e depois o Loading enquanto a sessão
 * é restaurada, e só então revela a navegação real. A árvore de rotas
 * é escolhida de acordo com o estado de autenticação através de
 * `Stack.Protected`: visitante navega em `(auth)` (Home pública →
 * Login); missionário logado navega em `(tabs)` (Perfil/Mapa/Diário) e
 * `(modals)` (edição de perfil). `missionary/[missionaryId]` é
 * compartilhada pelos dois mundos, empilhada por cima de qualquer uma
 * das duas árvores. `ConnectionBanner` fica montado globalmente acima
 * de toda a navegação, para avisar sobre falta de conexão em qualquer
 * tela.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ConnectionProvider>
            <AuthProvider>
              <MissionaryProvider>
                <MapProvider>
                  <DiaryProvider>
                    <StatusBar style="auto" />
                    <RootNavigatorGate />
                  </DiaryProvider>
                </MapProvider>
              </MissionaryProvider>
            </AuthProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const RootNavigatorGate: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const { user, isLoading } = useAuth();

  if (isBooting || isLoading) {
    return isBooting ? (
      <SplashScreen onFinish={() => setIsBooting(false)} />
    ) : (
      <LoadingScreen />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ConnectionBanner />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
          </Stack.Protected>
          <Stack.Screen name="missionary/[missionaryId]" options={{ animation: "slide_from_right" }} />
        </Stack>
      </View>
    </View>
  );
};

/**
 * Error Boundary global do Expo Router: captura erros de renderização
 * em qualquer rota e exibe a tela de erro já existente no projeto
 * (`ErrorScreen`), com opção de tentar novamente sem precisar
 * reiniciar o aplicativo.
 */
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <SafeAreaProvider>
      <ErrorScreen
        title="Algo deu errado"
        message={error.message || "Não foi possível carregar o conteúdo. Tente novamente."}
        onRetry={retry}
      />
    </SafeAreaProvider>
  );
}
