# PRODUCAO.md — Missão Calebe Porto Feliz 2026

Relatório da preparação do projeto para build de produção via **Expo EAS Build**
(Android e iOS). Nenhuma tela, componente, navegação, lógica ou estilo visual foi
alterado. Todas as mudanças abaixo são estritamente de **configuração e infraestrutura
de build**.

---

## 1. Arquivos modificados

| Arquivo | O que mudou | Por quê |
|---|---|---|
| `app.json` | Adicionado: `description`, `scheme`, `newArchEnabled`, `jsEngine`, `platforms`, `ios.buildNumber`, `ios.infoPlist` (permissão de localização, flag de criptografia), `ios.config.googleMapsApiKey`, `android.versionCode`, `android.permissions`, `android.config.googleMaps.apiKey`, `updates`, `runtimeVersion`, `extra.eas.projectId`, opções do plugin `expo-notifications`. Mantidos: nome, slug, version, orientation, ícone, splash, adaptive icon, package/bundle id originais. | Exigências mínimas para gerar build nativo instalável (permissões, versionamento, updates, Google Maps). |
| `package.json` | Removida a dependência `react-native-vector-icons`. Adicionadas: `@expo/vector-icons`, `expo-font`, `expo-dev-client`. Adicionado `engines.node`. | Ver seção "Problemas encontrados e corrigidos" — `react-native-vector-icons` puro exige linkagem nativa manual de fontes e quebraria o build gerenciado do EAS. `@expo/vector-icons` é o pacote oficial do Expo, 100% compatível com EAS Build, e é um substituto direto (mesmo nome de ícones, mesma API `<Icon name="..." size={...} color="..." />`), sem nenhuma alteração visual. |
| `tsconfig.json` | Adicionadas as opções `skipLibCheck` e `resolveJsonModule`. | Evita falhas de build por erros de tipagem em `node_modules` de terceiros; não afeta a checagem de tipos do código do app (`strict` continua ativo). |
| 14 arquivos em `src/components`, `src/navigation`, `src/screens` | Troca do import `"react-native-vector-icons/Ionicons"` → `"@expo/vector-icons/Ionicons"`. Nenhuma outra linha alterada. | Consequência direta da correção de dependência acima. Mesmo componente, mesma prop `name`, nenhum ícone, tamanho ou cor foi alterado. |

Lista completa dos 14 arquivos com o import ajustado:
`MapLegend.tsx`, `ConnectionBanner.tsx`, `MapMarkerPin.tsx`, `ConnectionStatusCard.tsx`,
`MapMarkerDetailContent.tsx`, `DiaryDayCard.tsx`, `PhotoGrid.tsx`, `MarkerTypeChip.tsx`,
`FloatingTabBar.tsx`, `MapScreen.tsx`, `MissionaryDetailScreen.tsx`,
`EditProfileScreen.tsx`, `DiaryDayScreen.tsx`, `MissionaryListScreen.tsx`.

`babel.config.js` **não foi alterado** — já estava correto (`babel-preset-expo` +
`react-native-reanimated/plugin` como último plugin).

## 2. Arquivos criados

| Arquivo | Finalidade |
|---|---|
| `eas.json` | Perfis de build `development`, `preview` e `production` + perfil de `submit`. |
| `metro.config.js` | Configuração padrão do Metro bundler (`expo/metro-config`), ausente no projeto original. |
| `.gitignore` | Ignora `node_modules`, `.expo`, builds nativos, credenciais e arquivos de ambiente. |
| `assets/icon.png` (1024×1024) | Ícone placeholder no padrão visual da marca (verde `#7ED321` + azul-marinho `#123A5E`). |
| `assets/adaptive-icon.png` (1024×1024, fundo transparente) | Foreground do Adaptive Icon do Android. |
| `assets/splash.png` (1284×2778) | Splash screen placeholder no mesmo verde da marca. |
| `assets/notification-icon.png` (96×96) | Ícone monocromático para a barra de notificações do Android (usado pelo plugin `expo-notifications`). |
| `PRODUCAO.md` | Este relatório. |

> **Sobre os placeholders de ícone/splash**: o projeto original não continha nenhuma
> pasta `assets/`, apesar de `app.json` já referenciá-la. Foram criados placeholders
> simples com a paleta oficial (`palette.green500`/`palette.navy500`, definida em
> `src/theme/colors.ts`) apenas para que o build não falhe por asset ausente.
> **Recomenda-se substituí-los pela arte final da logo "CALEBE"** antes da publicação
> nas lojas — a substituição é só trocar o arquivo PNG, sem tocar em código.

## 3. Configurações realizadas

### Expo (`app.json`)
- `scheme`: `missaocalebe` (deep linking / abertura via link).
- `newArchEnabled: false` e `jsEngine: hermes` fixados explicitamente para build
  previsível com as versões atuais de `react-native-maps`, `react-native-reanimated`
  e `react-native-screens`.
- `runtimeVersion.policy: "appVersion"` + bloco `updates` — pré-requisito do EAS Update
  (opcional, não obrigatório para builds nativas).
- `extra.eas.projectId`: placeholder — é preenchido automaticamente na primeira vez
  que você rodar `eas init` / `eas build`.

### Android
- **Package name**: `com.missaocalebe.portofeliz2026` (mantido do original).
- **Version code**: `1`.
- **Min/Target SDK**: gerenciados automaticamente pelo `expo` SDK 51 (Target SDK 34,
  Min SDK 23) — não é necessário declarar manualmente em projetos gerenciados EAS.
- **Adaptive Icon**: `foregroundImage` + `backgroundColor` configurados.
- **Permissões**: `ACCESS_COARSE_LOCATION` e `ACCESS_FINE_LOCATION` (usadas pelo
  `showsUserLocation` do `react-native-maps` em `MapScreen.tsx`), `RECEIVE_BOOT_COMPLETED`
  e `SCHEDULE_EXACT_ALARM` (necessárias para a arquitetura de notificações agendadas do
  `expo-notifications`, já presente no projeto).
- **Google Maps API Key**: placeholder em `android.config.googleMaps.apiKey`
  (`MapScreen.tsx` usa `PROVIDER_GOOGLE` explicitamente — **obrigatório** preencher
  antes de gerar a build final, ou o mapa aparecerá em branco no Android).

### iOS
- **Bundle Identifier**: `com.missaocalebe.portofeliz2026` (mantido do original).
- **Build Number**: `1`.
- **Permissões**: `NSLocationWhenInUseUsageDescription` (obrigatória pela Apple, pois
  o mapa usa `showsUserLocation`).
- **Google Maps API Key**: placeholder em `ios.config.googleMapsApiKey` (opcional no
  iOS — sem ela o app usa o provedor padrão da Apple ao invés do Google, mas como o
  código força `PROVIDER_GOOGLE`, recomenda-se preencher também aqui).
- `ITSAppUsesNonExemptEncryption: false` — evita pergunta manual sobre criptografia
  no App Store Connect a cada envio.

### EAS (`eas.json`)
- **development**: `developmentClient: true`, gera APK debug (Android) e build para
  simulador (iOS) — uso com Expo Dev Client.
- **preview**: gera APK (Android) instalável diretamente em qualquer aparelho, build
  de dispositivo real (iOS) — ideal para testes internos/TestFlight interno.
- **production**: gera AAB (Android, formato exigido pela Play Store) e build de
  produção iOS com incremento automático de `buildNumber` — ideal para publicação.
- **submit**: perfis prontos para `eas submit`, com placeholders para a conta de
  serviço do Google Play e credenciais da App Store Connect.

## 4. Dependências

### Adicionadas
| Pacote | Versão | Motivo |
|---|---|---|
| `@expo/vector-icons` | `^14.0.2` | Substitui `react-native-vector-icons` com compatibilidade nativa total no EAS Build (fontes embutidas automaticamente via `expo-font`, sem linkagem manual). |
| `expo-font` | `~12.0.9` | Dependência direta do `@expo/vector-icons`. |
| `expo-dev-client` | `~4.0.28` | Necessário para o perfil `development` do EAS (Development Build). |

### Removidas
| Pacote | Motivo |
|---|---|
| `react-native-vector-icons` | Exige linkagem nativa manual (Android: `build.gradle`; iOS: `Info.plist` + fontes no Xcode) que **não** é feita automaticamente em builds gerenciadas do EAS. Sem essa correção, todos os ícones do app apareceriam como quadrados vazios (☐) em builds de produção. Substituído por `@expo/vector-icons/Ionicons`, com a mesma API e o mesmo conjunto de ícones — nenhum ícone visualmente diferente. |

### Mantidas (já corretas para o Expo SDK 51 / React Native 0.74)
`expo ~51.0.0`, `expo-status-bar ~1.12.0`, `expo-linear-gradient ~13.0.0`,
`expo-image ~1.12.0`, `expo-notifications ~0.28.0`, `expo-blur ~13.0.0`,
`expo-splash-screen ~0.27.0`, `react 18.2.0`, `react-native 0.74.0`,
`react-native-safe-area-context 4.10.1`, `react-native-screens 3.31.1`,
`react-native-gesture-handler ~2.16.1`, `react-native-reanimated ~3.10.1`,
`react-native-svg 15.2.0`, `react-native-maps 1.14.0`,
`@react-navigation/native ^6.1.17`, `@react-navigation/native-stack ^6.9.26`,
`@react-navigation/bottom-tabs ^6.5.20`,
`@react-native-async-storage/async-storage 1.23.1`, `typescript ^5.3.0`,
`@types/react ~18.2.79`, `@babel/core ^7.24.0`.

Nenhuma dessas versões foi alterada — todas já são compatíveis entre si e com o
Expo SDK 51.

## 5. Versões utilizadas

- **Expo SDK**: 51
- **React Native**: 0.74.0
- **React**: 18.2.0
- **Node.js recomendado**: 18 LTS ou superior (`engines.node` adicionado ao `package.json`)
- **EAS CLI**: `>= 12.0.0` (definido em `eas.json`)

## 6. Como gerar as builds

Pré-requisitos (uma única vez):
```bash
npm install -g eas-cli
eas login
cd missao-calebe-porto-feliz-2026
npm install
eas init          # vincula o projeto e preenche extra.eas.projectId automaticamente
```

Antes de gerar builds finais, **preencha os placeholders**:
- `app.json` → `android.config.googleMaps.apiKey` e `ios.config.googleMapsApiKey`
  (chaves do Google Maps Platform).
- `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png` → arte final da logo.

### Gerar APK (teste interno / instalação direta)
```bash
eas build --platform android --profile preview
```

### Gerar AAB (Play Store)
```bash
eas build --platform android --profile production
```

### Gerar build iOS (TestFlight / App Store)
```bash
eas build --platform ios --profile production
```

### Development Build (Expo Dev Client, para desenvolvimento com todos os módulos nativos)
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```

## 7. Como publicar

### Play Store
1. Gere o AAB: `eas build --platform android --profile production`.
2. Crie o app no [Google Play Console](https://play.google.com/console) (se ainda não existir), preenchendo ficha da loja, política de privacidade e classificação indicativa.
3. Gere uma conta de serviço do Google Cloud com permissão de "Release Manager" e salve o JSON como `google-service-account.json` na raiz do projeto (já referenciado em `eas.json`).
4. Publique com `eas submit --platform android --profile production` ou faça upload manual do `.aab` no Play Console.

### App Store
1. Gere a build: `eas build --platform ios --profile production`.
2. Crie o app no [App Store Connect](https://appstoreconnect.apple.com) com o mesmo Bundle Identifier (`com.missaocalebe.portofeliz2026`).
3. Preencha em `eas.json` → `submit.production.ios`: `appleId`, `ascAppId` e `appleTeamId`.
4. Publique com `eas submit --platform ios --profile production` ou envie manualmente via Transporter.

## 8. Problemas encontrados

1. **Pasta `assets/` inexistente** — `app.json` referenciava `./assets/icon.png`,
   `./assets/splash.png` e `./assets/adaptive-icon.png`, mas nenhum desses arquivos
   existia no projeto. Isso causaria falha imediata no `expo prebuild`/`eas build`.
2. **`react-native-vector-icons` sem linkagem nativa** — usado em 14 arquivos via
   `Icon from "react-native-vector-icons/Ionicons"`. Em builds gerenciadas pelo EAS
   (sem código nativo customizado no repositório), esse pacote não tem suas fontes
   `.ttf` embutidas automaticamente, resultando em ícones quebrados (☐) na build final,
   apesar de funcionar normalmente no Expo Go durante o desenvolvimento.
3. **Ausência de `eas.json`** — sem esse arquivo, o comando `eas build` não teria
   perfis definidos e falharia ao perguntar como gerar APK/AAB/iOS.
4. **Ausência de `metro.config.js`** — não impede o funcionamento (Expo usa um config
   padrão internamente), mas sua ausência dificulta customizações futuras de bundling
   e não é considerado uma prática de produção completa.
5. **Uso de `PROVIDER_GOOGLE` no `MapScreen.tsx` sem chave de API configurada** —
   sem uma Google Maps API Key válida, o mapa aparece em branco/cinza no Android (a
   chave é obrigatória nessa plataforma quando o provedor Google é forçado).
6. **Sem permissões nativas de localização declaradas** — `showsUserLocation` no mapa
   exige `NSLocationWhenInUseUsageDescription` (iOS) e `ACCESS_FINE_LOCATION`/
   `ACCESS_COARSE_LOCATION` (Android); sem elas, o app pode ser rejeitado nas lojas ou
   travar ao solicitar localização.

## 9. Problemas corrigidos

- ✅ Placeholders de ícone/splash/adaptive icon criados na paleta oficial da marca.
- ✅ `react-native-vector-icons` substituído por `@expo/vector-icons` (mesmo conjunto
  de ícones, mesma API, zero mudança visual) em todos os 14 arquivos.
- ✅ `eas.json` criado com perfis `development`, `preview`, `production` e `submit`.
- ✅ `metro.config.js` criado com a configuração padrão do Expo.
- ✅ Placeholders de Google Maps API Key adicionados em `app.json` (iOS e Android),
  com instrução explícita de preenchimento antes da build final.
- ✅ Permissões de localização declaradas para iOS e Android.
- ✅ `versionCode` (Android) e `buildNumber` (iOS) configurados para permitir
  incrementos de versão nas lojas.
- ✅ `.gitignore` criado para evitar commit acidental de `node_modules`, builds
  nativas e credenciais.

## 10. O que **não** foi alterado (por escopo)

- Nenhuma tela, componente, estilo, cor, animação ou navegação.
- Nenhuma lógica de negócio, contexto ou serviço mock.
- Nenhuma integração com Firebase foi adicionada (mantido 100% mock/local, conforme
  o `RELATORIO.md` original).
- Nenhuma nova tela ou funcionalidade foi criada.

## 11. Checklist final

- [x] `app.json` completo (nome, slug, versão, ícones, splash, permissões, bundle/package, updates, runtime version).
- [x] `eas.json` com perfis `development`, `preview`, `production`.
- [x] `package.json` com dependências corrigidas e compatíveis com Expo SDK 51.
- [x] `babel.config.js` revisado (já estava correto).
- [x] `tsconfig.json` revisado e reforçado.
- [x] `metro.config.js` criado.
- [x] Assets de ícone/splash/adaptive icon presentes (placeholders — **substituir pela arte final antes de publicar**).
- [x] Permissões Android e iOS declaradas.
- [x] `.gitignore` criado.
- [ ] **Pendente do usuário**: preencher a Google Maps API Key (Android e iOS) em `app.json`.
- [ ] **Pendente do usuário**: substituir os placeholders de ícone/splash pela arte final da logo "CALEBE".
- [ ] **Pendente do usuário**: rodar `eas init` para vincular o projeto e preencher `extra.eas.projectId`.
- [ ] **Pendente do usuário**: preencher credenciais de `submit` em `eas.json` (Google Play e App Store Connect) antes de publicar.
- [ ] **Recomendado**: rodar `npx expo start` e `npx tsc --noEmit` localmente (com `npm install`) antes da build final, já que este ambiente não possui acesso à internet para instalar `node_modules` e validar o build de ponta a ponta.
