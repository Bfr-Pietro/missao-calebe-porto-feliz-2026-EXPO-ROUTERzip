import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types";
import { mockCredentials } from "../mocks/users";
import { STORAGE_KEYS } from "../constants";

/**
 * Serviço de autenticação simulado (mock).
 *
 * Este arquivo define o CONTRATO que a futura integração com
 * Firebase Authentication deverá respeitar, para que a troca de
 * implementação não exija mudanças no restante do app — apenas
 * a substituição do corpo destas funções.
 */

export interface IAuthService {
  signIn(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  getPersistedUser(): Promise<AuthUser | null>;
}

const simulateNetworkDelay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const authService: IAuthService = {
  async signIn(email: string, password: string) {
    await simulateNetworkDelay();

    const match = mockCredentials.find(
      (entry) =>
        entry.email.toLowerCase() === email.trim().toLowerCase() &&
        entry.password === password
    );

    if (!match) {
      throw new Error("Email ou senha inválidos.");
    }

    await AsyncStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(match.user));
    return match.user;
  },

  async signOut() {
    await simulateNetworkDelay(200);
    await AsyncStorage.removeItem(STORAGE_KEYS.authUser);
  },

  async getPersistedUser() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },
};
