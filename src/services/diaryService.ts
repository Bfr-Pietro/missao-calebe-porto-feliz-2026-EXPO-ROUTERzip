import { DiaryEntry } from "../types";
import { storageService } from "./storageService";
import { STORAGE_KEYS } from "../constants";

/**
 * Serviço de Diário (mock).
 *
 * Define o CONTRATO que a futura integração com Cloud Firestore
 * deverá respeitar (subcoleção "diaryEntries" por usuário). Cada
 * missionário possui seus próprios registros, isolados por uma chave
 * de armazenamento específica (`STORAGE_KEYS.diaryEntries:{userId}`),
 * garantindo que ninguém acesse o diário de outra pessoa mesmo neste
 * mock local.
 */
export interface IDiaryService {
  getAllForUser(userId: string): Promise<DiaryEntry[]>;
  saveEntry(userId: string, date: string, content: string): Promise<DiaryEntry>;
  deleteEntry(userId: string, date: string): Promise<void>;
}

const simulateNetworkDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const keyForUser = (userId: string) => `${STORAGE_KEYS.diaryEntries}:${userId}`;

async function readAll(userId: string): Promise<DiaryEntry[]> {
  const persisted = await storageService.getItem<DiaryEntry[]>(keyForUser(userId));
  return persisted ?? [];
}

export const diaryService: IDiaryService = {
  async getAllForUser(userId) {
    await simulateNetworkDelay();
    return readAll(userId);
  },

  async saveEntry(userId, date, content) {
    await simulateNetworkDelay();
    const all = await readAll(userId);
    const index = all.findIndex((item) => item.date === date);
    const entry: DiaryEntry = { date, content, updatedAt: new Date().toISOString() };

    const nextAll = [...all];
    if (index === -1) {
      nextAll.push(entry);
    } else {
      nextAll[index] = entry;
    }

    await storageService.setItem(keyForUser(userId), nextAll);
    return entry;
  },

  async deleteEntry(userId, date) {
    await simulateNetworkDelay();
    const all = await readAll(userId);
    const nextAll = all.filter((item) => item.date !== date);
    await storageService.setItem(keyForUser(userId), nextAll);
  },
};
