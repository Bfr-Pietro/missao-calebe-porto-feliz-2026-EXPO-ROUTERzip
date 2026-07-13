import { Missionary } from "../types";
import { missionariesMock } from "../mocks/missionaries";
import { storageService } from "./storageService";
import { STORAGE_KEYS } from "../constants";

/**
 * Serviço de missionários simulado (mock).
 *
 * Define o CONTRATO que a futura integração com Cloud Firestore deverá
 * respeitar (coleção "missionaries"). Nesta etapa, a lista é semeada a
 * partir de `missionariesMock` e persistida localmente via AsyncStorage
 * para que as edições de perfil sobrevivam entre sessões do app.
 */
export interface IMissionaryService {
  getAll(): Promise<Missionary[]>;
  getById(id: string): Promise<Missionary | null>;
  update(id: string, changes: Partial<Missionary>): Promise<Missionary>;
}

const simulateNetworkDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function readAll(): Promise<Missionary[]> {
  const persisted = await storageService.getItem<Missionary[]>(STORAGE_KEYS.missionaries);
  if (persisted && persisted.length > 0) return persisted;
  await storageService.setItem(STORAGE_KEYS.missionaries, missionariesMock);
  return missionariesMock;
}

export const missionaryService: IMissionaryService = {
  async getAll() {
    await simulateNetworkDelay(300);
    return readAll();
  },

  async getById(id: string) {
    const all = await readAll();
    return all.find((item) => item.id === id) ?? null;
  },

  async update(id: string, changes: Partial<Missionary>) {
    await simulateNetworkDelay();
    const all = await readAll();
    const index = all.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Missionário não encontrado.");

    const updated: Missionary = { ...all[index], ...changes };
    const nextAll = [...all];
    nextAll[index] = updated;

    await storageService.setItem(STORAGE_KEYS.missionaries, nextAll);
    return updated;
  },
};
