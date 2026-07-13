module.exports = function (api) {
  api.cache(true);
  return {
    // O plugin do Reanimated/Worklets (react-native-worklets/plugin) é
    // configurado automaticamente pelo babel-preset-expo a partir do
    // Expo SDK 54 — não é mais necessário declará-lo manualmente aqui.
    presets: ["babel-preset-expo"],
  };
};
