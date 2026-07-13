export const APP_NAME = "Missão Calebe Porto Feliz 2026";

export const MISSION = {
  name: "Missão Calebe 2026",
  slogan: "Minhas Férias no Topo!",
  church: "Igreja Adventista do Sétimo Dia — Porto Feliz, SP",
  startDate: "2026-07-01",
  endDate: "2026-08-01",
};

export const ADMIN_EMAIL = "admin@calebe.com";

// Datas fixas do diário de campo, conforme escopo do projeto.
export const DIARY_START_DATE = "2026-07-01";
export const DIARY_END_DATE = "2026-08-01";

export const STORAGE_KEYS = {
  authUser: "@calebe:auth_user",
  themeMode: "@calebe:theme_mode",
  diaryEntries: "@calebe:diary_entries",
  lastSync: "@calebe:last_sync",
  missionaries: "@calebe:missionaries",
  mapMarkers: "@calebe:map_markers",
};

// Região inicial do Mapa Missionário, centralizada em Porto Feliz - SP.
export const MAP_INITIAL_REGION = {
  latitude: -23.1998,
  longitude: -47.528,
  latitudeDelta: 0.045,
  longitudeDelta: 0.045,
};

// Limite de fotos na galeria pessoal do missionário (regra de UI, Etapa 4).
export const MAX_GALLERY_PHOTOS = 6;

export const ANIMATION_DURATION = {
  fast: 180,
  normal: 300,
  slow: 450,
};
