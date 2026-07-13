import { storageService } from "./storageService";
import { STORAGE_KEYS } from "../constants";

/**
 * Serviço de sincronização simulado. Representa, hoje, apenas a
 * gravação de um timestamp de "última sincronização" local. Esta
 * função será substituída pela sincronização real do Cloud Firestore
 * (persistência offline) em uma etapa futura do projeto.
 */
export const syncService = {
  async syncNow(): Promise<string> {
    const now = new Date().toISOString();
    await storageService.setItem(STORAGE_KEYS.lastSync, now);
    return now;
  },

  async getLastSync(): Promise<string | null> {
    return storageService.getItem<string>(STORAGE_KEYS.lastSync);
  },
};
