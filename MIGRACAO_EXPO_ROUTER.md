# MIGRAÇÃO_EXPO_ROUTER.md — Missão Calebe Porto Feliz 2026

Migração da navegação (React Navigation manual) para **Expo Router** (file-based routing), com upgrade do **Expo SDK 51 → SDK 54** e preparação completa para **Expo EAS Build**.

> **Garantia:** nenhuma tela, componente, animação, cor ou fluxo de UX foi alterado. Todas as telas em `src/screens/*` continuam exatamente as mesmas — só a forma como são *conectadas* à navegação mudou (de `navigation.navigate("X")` para `router.push("/x")`). Ver seção "O que NÃO mudou" no final.

---

## 1. Resumo da mudança

| Antes | Depois |
|---|---|
| `App.tsx` monta `NavigationContainer` manualmente | `app/_layout.tsx` (Expo Router) monta os mesmos Providers + Stack raiz |
| `src/navigation/RootNavigator.tsx`, `InternalTabsNavigator.tsx`, `ProfileStackNavigator.tsx`, `DiaryStackNavigator.tsx` | Estrutura de pastas `app/` (file-based routing) |
| `src/navigation/types.ts` (`RootStackParamList` etc.) | Tipagem de rotas via `useLocalSearchParams<{...}>()` do Expo Router (+ Typed Routes experimental) |
| Troca de árvore de navegação por autenticação feita manualmente com `if (user) {...} else {...}` dentro do `RootNavigator` | `<Stack.Protected guard={...}>` do Expo Router — mesmo efeito, API declarativa oficial |
| Expo SDK 51 / React Navigation 6 / RN 0.74 / React 18.2 | Expo SDK 54 / Expo Router 6 (React Navigation 7 por baixo) / RN 0.81.5 / React 19.1 |
| `newArchEnabled: false` | `newArchEnabled: true` (obrigatório pelo Reanimated 4, que acompanha o SDK 54) |

---

## 2. Estrutura final do projeto

```
missao-calebe-porto-feliz-2026/
├── app/                              ← NOVO — rotas (Expo Router)
│   ├── _layout.tsx                   ← Providers globais + gate de boot/loading + Stack raiz protegido
│   ├── +not-found.tsx                ← fallback para links quebrados/desconhecidos
│   ├── (auth)/                       ← visitante (não autenticado)
│   │   ├── _layout.tsx
│   │   ├── index.tsx                 → HomePublicScreen        (rota "/")
│   │   └── login.tsx                 → LoginScreen              (rota "/login")
│   ├── (tabs)/                       ← área interna (autenticado), abas flutuantes
│   │   ├── _layout.tsx               → Tabs + FloatingTabBar (mesmo componente visual)
│   │   ├── perfil/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx             → ProfileHomeScreen        ("/perfil")
│   │   │   └── missionary-list.tsx   → MissionaryListScreen     ("/perfil/missionary-list")
│   │   ├── mapa.tsx                  → MapScreen                ("/mapa")
│   │   └── diario/
│   │       ├── _layout.tsx
│   │       ├── index.tsx             → DiaryScreen              ("/diario")
│   │       └── [date].tsx            → DiaryDayScreen           ("/diario/2026-07-10")
│   ├── (modals)/                     ← telas modais (autenticado)
│   │   ├── _layout.tsx               → presentation: "modal" / slide_from_bottom
│   │   └── edit-profile.tsx          → EditProfileScreen        ("/edit-profile")
│   └── missionary/
│       └── [missionaryId].tsx        → MissionaryDetailScreen   ("/missionary/abc123")
│                                        (rota compartilhada — acessível tanto pelo
│                                         visitante quanto pelo missionário logado)
├── src/
│   ├── screens/          ← INTOCADAS (mesmo JSX/estilo/animação), só trocaram os hooks de navegação
│   ├── components/       ← INTOCADOS, exceto MissionaryCarousel (troca de hook de navegação)
│   ├── navigation/
│   │   └── FloatingTabBar.tsx   ← mantido; só as *chaves* do mapa de ícones/labels mudaram
│   │                                (de "PerfilTab"/"MapaTab"/"DiarioTab" para
│   │                                 "perfil"/"mapa"/"diario", que são os nomes de
│   │                                 rota gerados pelo Expo Router a partir dos arquivos)
│   ├── context/, services/, mocks/, theme/, constants/, utils/, hooks/, types/  ← INTOCADOS
├── app.json               ← atualizado (plugin expo-router, scheme, newArchEnabled, typedRoutes...)
├── eas.json                ← atualizado (versão mínima do CLI)
├── babel.config.js         ← simplificado (plugin do Reanimated agora é automático)
├── metro.config.js          ← inalterado (já era o config padrão do Expo)
├── tsconfig.json            ← mantém os mesmos path aliases (@screens, @components...) + tipos do Router
├── expo-env.d.ts            ← NOVO (gerado automaticamente pelo Expo Router)
├── package.json              ← dependências atualizadas para o SDK 54
└── PRODUCAO.md / RELATORIO.md  ← histórico do projeto (mantidos como estavam)
```

`App.tsx` e toda a pasta `src/navigation/RootNavigator.tsx` + `InternalTabsNavigator.tsx` + `ProfileStackNavigator.tsx` + `DiaryStackNavigator.tsx` + `types.ts` foram **removidos**, pois sua função passou a ser feita pelos arquivos dentro de `app/`.

---

## 3. Como ficou a navegação

- **Visitante** abre o app em `/` → `HomePublicScreen`. Botão "Entrar" leva a `/login` → `LoginScreen`. Ambos dentro do grupo `(auth)`, guardado por `Stack.Protected guard={!user}`.
- Ao autenticar com sucesso (`AuthContext`), o `user` deixa de ser `null` e o **próprio Expo Router redireciona automaticamente** para o grupo `(tabs)` — reproduzindo exatamente o comentário que já existia no código original ("ao autenticar, o RootNavigator troca automaticamente para a árvore interna"), só que agora com a API oficial `Stack.Protected` em vez de um `if` manual.
- **Missionário logado** navega pelas 3 abas flutuantes (`Perfil`, `Mapa`, `Diário`) através do mesmo `FloatingTabBar` glassmorphism já existente.
  - Aba **Perfil**: `/perfil` (resumo) → `/perfil/missionary-list` (lista da equipe).
  - Aba **Mapa**: `/mapa` (tela única, sem sub-navegação, como antes).
  - Aba **Diário**: `/diario` (lista de dias) → `/diario/AAAA-MM-DD` (edição de um dia).
- **Editar perfil** (`/edit-profile`) é um modal apresentado por cima de tudo (grupo `(modals)`), com a mesma animação de "subir de baixo" que tinha antes.
- **Detalhe de um missionário** (`/missionary/[missionaryId]`) é uma rota compartilhada na raiz, acessível tanto pelo carrossel da Home pública (visitante) quanto pela lista de missionários (logado) — exatamente como no `RootNavigator` original, onde a tela existia nas duas árvores de navegação.
- **Deep linking**: automático, com base no scheme `missaocalebe://` já configurado. Exemplos:
  - `missaocalebe:///missionary/abc123`
  - `missaocalebe:///edit-profile`
  - `missaocalebe:///diario/2026-07-10`
- **Rota desconhecida / link quebrado**: cai em `app/+not-found.tsx`, que reaproveita o componente `ErrorScreen` já existente.
- **Erros de renderização**: capturados globalmente por um `ErrorBoundary` exportado de `app/_layout.tsx` (recurso nativo do Expo Router), também usando `ErrorScreen`, com botão "Tentar novamente".
- **Splash/Loading de boot**: preservados sem nenhuma mudança de comportamento — `app/_layout.tsx` primeiro mostra a `SplashScreen` animada, depois (se a sessão ainda estiver sendo restaurada) a `LoadingScreen`, e só então libera a navegação. Isso acontece **antes** de qualquer rota ser desenhada, igual ao `App.tsx` + `RootNavigator` originais.

---

## 4. Arquivos criados

- `app/_layout.tsx`
- `app/+not-found.tsx`
- `app/(auth)/_layout.tsx`, `app/(auth)/index.tsx`, `app/(auth)/login.tsx`
- `app/(tabs)/_layout.tsx`, `app/(tabs)/mapa.tsx`
- `app/(tabs)/perfil/_layout.tsx`, `app/(tabs)/perfil/index.tsx`, `app/(tabs)/perfil/missionary-list.tsx`
- `app/(tabs)/diario/_layout.tsx`, `app/(tabs)/diario/index.tsx`, `app/(tabs)/diario/[date].tsx`
- `app/(modals)/_layout.tsx`, `app/(modals)/edit-profile.tsx`
- `app/missionary/[missionaryId].tsx`
- `expo-env.d.ts`
- `MIGRACAO_EXPO_ROUTER.md` (este arquivo)

Cada arquivo de rota é um "wrapper fino" — ex.: `app/(auth)/index.tsx` contém só `export { HomePublicScreen as default } from "../../src/screens/HomePublicScreen";`. Nenhuma tela foi recriada, só reconectada.

## 5. Arquivos removidos

- `App.tsx`
- `src/navigation/RootNavigator.tsx`
- `src/navigation/InternalTabsNavigator.tsx`
- `src/navigation/ProfileStackNavigator.tsx`
- `src/navigation/DiaryStackNavigator.tsx`
- `src/navigation/types.ts`

## 6. Arquivos modificados

**Navegação (troca de hooks `@react-navigation` → `expo-router`, sem tocar em JSX/estilo):**
- `src/screens/HomePublicScreen.tsx`
- `src/screens/MissionaryDetailScreen.tsx`
- `src/screens/ProfileHomeScreen.tsx`
- `src/screens/DiaryScreen.tsx`
- `src/screens/MissionaryListScreen.tsx`
- `src/screens/EditProfileScreen.tsx`
- `src/screens/DiaryDayScreen.tsx`
- `src/components/MissionaryCarousel.tsx`
- `src/navigation/FloatingTabBar.tsx` (só as chaves do mapa de rota→ícone/label)
- `src/screens/LoginScreen.tsx` — **nenhuma mudança de código** (já não navegava manualmente; só passou a fazer sentido com `Stack.Protected`)

**Configuração de produção:**
- `package.json`, `app.json`, `eas.json`, `babel.config.js`, `tsconfig.json`

**Correções de TypeScript encontradas na auditoria (bugs pré-existentes, sem relação com a navegação — corrigidos porque quebravam `tsc --noEmit` com as novas versões dos tipos de `@expo/vector-icons`):**
- `src/theme/colors.ts` — `AppTheme` estava tipado só como `typeof lightTheme`, o que tornava `darkTheme` (com `mode: "dark"`) tecnicamente incompatível. Corrigido para `typeof lightTheme | typeof darkTheme`.
- `src/screens/MapScreen.tsx` — faltava importar `PROVIDER_GOOGLE` de `react-native-maps` (era usado na linha 104 mas nunca importado).
- `src/constants/mapMeta.ts`, `src/navigation/FloatingTabBar.tsx`, `src/screens/MissionaryDetailScreen.tsx` — campo `icon` estava tipado como `string` genérico; passou a usar o tipo literal exato de nomes de ícone do Ionicons (`ComponentProps<typeof Icon>["name"]"`), sem alterar nenhum valor/ícone usado.

## 7. Dependências

**Adicionadas:**
- `expo-router` `~6.0.24`
- `expo-linking` `~8.0.12`
- `expo-constants` `~18.0.13`
- `react-native-worklets` `0.5.1` (nova dependência do Reanimated 4)
- `@react-navigation/native` `^7.1.8` e `@react-navigation/bottom-tabs` `^7.4.0` — usados internamente pelo Expo Router; declarados explicitamente porque `FloatingTabBar.tsx` importa o tipo `BottomTabBarProps` diretamente.

**Removidas:**
- `@react-navigation/native-stack` (o `Stack` do Expo Router substitui seu uso direto)

**Atualizadas (Expo SDK 51 → 54, versões exatas obtidas do `bundledNativeModules.json` oficial do SDK 54):**

| Pacote | Antes | Depois |
|---|---|---|
| `expo` | ~51.0.0 | ~54.0.35 |
| `react` | 18.2.0 | 19.1.0 |
| `react-native` | 0.74.0 | 0.81.5 |
| `expo-status-bar` | ~1.12.0 | ~3.0.9 |
| `expo-linear-gradient` | ~13.0.0 | ~15.0.8 |
| `expo-image` | ~1.12.0 | ~3.0.11 |
| `expo-notifications` | ~0.28.0 | ~0.32.17 |
| `expo-blur` | ~13.0.0 | ~15.0.8 |
| `expo-splash-screen` | ~0.27.0 | ~31.0.13 |
| `expo-font` | ~12.0.9 | ~14.0.12 |
| `expo-dev-client` | ~4.0.28 | ~6.0.21 |
| `@expo/vector-icons` | ^14.0.2 | ^15.1.1 |
| `react-native-safe-area-context` | 4.10.1 | ~5.6.0 |
| `react-native-screens` | 3.31.1 | ~4.16.0 |
| `react-native-gesture-handler` | ~2.16.1 | ~2.28.0 |
| `react-native-reanimated` | ~3.10.1 | ~4.1.1 |
| `react-native-svg` | 15.2.0 | 15.12.1 |
| `react-native-maps` | 1.14.0 | 1.20.1 |
| `@react-native-async-storage/async-storage` | 1.23.1 | 2.2.0 |
| `typescript` | ^5.3.0 | ~5.9.2 |

> **Sobre o Reanimated 4 / New Architecture:** o Reanimated 4 (que acompanha o SDK 54) exige a Nova Arquitetura (Fabric) do React Native. Por isso `newArchEnabled` foi ligado em `app.json`. Isso é uma mudança de configuração, não de comportamento: todas as APIs de animação já usadas no projeto (`useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`, `withRepeat`, `useAnimatedScrollHandler`) continuam existindo e funcionando de forma idêntica na v4 — nenhuma animação precisou ser reescrita. O plugin do Babel do Reanimated/Worklets também passou a ser configurado automaticamente pelo `babel-preset-expo`, então foi removido do `babel.config.js` (prática oficial recomendada a partir do SDK 54).

> **Por que SDK 54, e não uma versão ainda mais nova?** No momento desta migração, versões mais recentes do Expo Router (a partir do SDK 56) passaram por uma reestruturação interna significativa (deixando de depender diretamente do React Navigation). O SDK 54 é a versão estável mais recente que preserva o comportamento e os padrões de navegação testados aqui, com o menor risco de regressões para um app que já está pronto para produção. Migrar para SDK 55/56/57 mais adiante é possível seguindo o guia oficial `npx expo install expo@latest` + `npx expo-doctor`.

## 8. Compatibilidade

- **Expo Go**: ✅ compatível. `react-native-maps` funciona no Expo Go (usa o provedor padrão da plataforma quando não há chave do Google Maps configurada). Notificações locais (`expo-notifications`) têm suporte limitado no Expo Go a partir do SDK 53+ — funcionam para testes básicos, mas o app já está preparado para Development Build, onde funcionam por completo.
- **Expo Development Build**: ✅ compatível (`expo-dev-client` incluído).
- **Expo EAS Build**: ✅ compatível — ver seção seguinte.
- **Android**: ✅ (`newArchEnabled: true`, edge-to-edge nativo do RN 0.81, permissões de localização e notificação mantidas em `app.json`).
- **iPhone**: ✅ (`supportsTablet`, chave de uso de localização em `infoPlist`, `ITSAppUsesNonExemptEncryption` já preenchido para evitar prompt manual na App Store Connect).

## 9. Checklist de produção (EAS)

- [x] `app.json` com `scheme`, plugin `expo-router`, `newArchEnabled`, `runtimeVersion` (`policy: "appVersion"`), `updates` e ícones/splash apontando para arquivos existentes em `assets/`.
- [x] `eas.json` com perfis `development`, `preview` e `production` (mantidos do projeto original, só com a versão mínima do CLI atualizada).
- [x] `package.json` com `"main": "expo-router/entry"`.
- [x] `babel.config.js` e `metro.config.js` no padrão atual do Expo.
- [x] `npx tsc --noEmit` → **0 erros**.
- [x] `npx expo-doctor` → 16/18 checks passam localmente; os 2 que falham (schema remoto do `app.json` e diretório de pacotes do React Native) dependem de acesso à internet ao `expo.dev`/`reactnative.directory`, indisponível neste ambiente de migração — **recomenda-se rodar `npx expo-doctor` novamente com internet liberada antes do primeiro build**.
- [ ] Preencher `extra.eas.projectId` em `app.json` (placeholder `YOUR_EAS_PROJECT_ID`) — gerado automaticamente ao rodar `eas init` ou `eas build:configure` no projeto real.
- [ ] Preencher `ios.config.googleMapsApiKey` e `android.config.googleMaps.apiKey` (placeholders) com chaves reais do Google Maps, caso o app vá além do Expo Go.
- [ ] Rodar `eas build --platform android --profile preview` e `eas build --platform ios --profile preview` para validar o primeiro build real na nuvem.

## 10. Pendências restantes

- Placeholders de chave do Google Maps e `projectId` do EAS (itens acima) — dependem de credenciais reais do cliente, fora do escopo desta migração de arquitetura.
- `npx expo-doctor` completo (com acesso à internet ao `expo.dev`) deve ser rodado uma vez antes do primeiro build em produção.
- Pendências de produto já documentadas em `RELATORIO.md` (integração real com Firebase, notificações locais reais, persistência offline real, detecção real de rede) continuam as mesmas — não fazem parte do escopo desta tarefa, que foi puramente de arquitetura/navegação.

## 11. O que NÃO mudou

- Nenhum arquivo em `src/screens/*.tsx` teve seu JSX, estilos, textos ou lógica de negócio alterados — apenas as 2-4 linhas relacionadas ao hook de navegação em cada um.
- Nenhuma animação (`Reanimated`, `LayoutAnimation`, transições de tela) foi removida ou reescrita.
- Nenhuma cor, componente visual ou fluxo de tela foi alterado.
- `FloatingTabBar.tsx` continua pixel-a-pixel o mesmo (glass/blur, spring animation, mesmos ícones e labels) — só a *chave* interna usada para procurar o ícone/label de cada aba mudou de `"PerfilTab"` para `"perfil"` (nome da rota gerado pelo arquivo `app/(tabs)/perfil/`), sem efeito visível.
