export type UserRole = "admin" | "missionario";

export interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
}

export interface Missionary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl: string;
  city: string;
  age: number;
  bio?: string;
  social: SocialLinks;
  gallery: string[];
}

export interface Church {
  id: string;
  name: string;
  address: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
}

export type FamilyStatus =
  | "visitar"
  | "retornar"
  | "rejeitou"
  | "finalizado";

export type MapMarkerType = FamilyStatus | "igreja";

export interface MapMarkerData {
  id: string;
  type: MapMarkerType;
  familyName: string;
  address: string;
  notes?: string;
  latitude: number;
  longitude: number;
}

export interface DiaryEntry {
  date: string; // formato ISO "YYYY-MM-DD"
  content: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl: string;
}

export interface SyncState {
  isOnline: boolean;
  lastSyncedAt: string | null;
}
