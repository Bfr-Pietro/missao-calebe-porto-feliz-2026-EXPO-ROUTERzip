import { MapMarkerData, MapMarkerType } from "../types";
import { mapMarkersMock } from "../mocks/mapMarkers";
import { storageService } from "./storageService";
import { STORAGE_KEYS } from "../constants";

/**
 * Serviço de marcadores do Mapa Missionário (mock).
 *
 * Define o CONTRATO que a futura integração com Cloud Firestore deverá
 * respeitar (coleção "mapMarkers"). Nesta etapa, a lista é semeada a
 * partir de `mapMarkersMock` e persistida localmente via AsyncStorage,
 * para que alterações de status e novos marcadores criados pelo
 * administrador sobrevivam entre sessões do app.
 */
export interface IMapService {
  getAll(): Promise<MapMarkerData[]>;
  updateStatus(id: string, type: MapMarkerType): Promise<MapMarkerData>;
  create(marker: Omit<MapMarkerData, "id">): Promise<MapMarkerData>;
}

const simulateNetworkDelay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function readAll(): Promise<MapMarkerData[]> {
  const persisted = await storageService.getItem<MapMarkerData[]>(STORAGE_KEYS.mapMarkers);
  if (persisted && persisted.length > 0) return persisted;
  await storageService.setItem(STORAGE_KEYS.mapMarkers, mapMarkersMock);
  return mapMarkersMock;
}

export const mapService: IMapService = {
  async getAll() {
    await simulateNetworkDelay(300);
    return readAll();
  },

  async updateStatus(id, type) {
    await simulateNetworkDelay();
    const all = await readAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Marcador não encontrado.");

    const updated: MapMarkerData = { ...all[index], type };
    const nextAll = [...all];
    nextAll[index] = updated;

    await storageService.setItem(STORAGE_KEYS.mapMarkers, nextAll);
    return updated;
  },

  async create(marker) {
    await simulateNetworkDelay();
    const all = await readAll();
    const newMarker: MapMarkerData = { ...marker, id: `marker-${Date.now()}` };
    const nextAll = [...all, newMarker];

    await storageService.setItem(STORAGE_KEYS.mapMarkers, nextAll);
    return newMarker;
  },
};
