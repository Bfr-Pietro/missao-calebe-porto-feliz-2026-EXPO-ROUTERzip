import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Camada de persistência local genérica.
 *
 * Hoje utiliza AsyncStorage puro (mock de persistência). A arquitetura
 * foi pensada para que, futuramente, estas mesmas funções passem a
 * delegar para o cache offline do Cloud Firestore sem alterar quem as
 * consome.
 */
export const storageService = {
  async getItem<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
