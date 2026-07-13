import { AuthUser } from "../types";

/**
 * Base mock de autenticação. Em produção isto será substituído por
 * Firebase Authentication — a interface authService já está preparada
 * para essa migração (ver src/services/authService.ts).
 */
export const mockCredentials: Array<{ email: string; password: string; user: AuthUser }> = [
  {
    email: "admin@calebe.com",
    password: "admin123",
    user: {
      id: "m1",
      name: "Admin Geral",
      email: "admin@calebe.com",
      role: "admin",
      photoUrl: "https://i.pravatar.cc/300?img=12",
    },
  },
  {
    email: "lucas@calebe.com",
    password: "calebe123",
    user: {
      id: "m2",
      name: "Lucas Andrade",
      email: "lucas@calebe.com",
      role: "missionario",
      photoUrl: "https://i.pravatar.cc/300?img=15",
    },
  },
];
