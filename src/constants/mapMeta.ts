import type { ComponentProps } from "react";
import type Icon from "@expo/vector-icons/Ionicons";
import { FamilyStatus, MapMarkerType } from "../types";

export type MapMarkerColorKey =
  | "statusVisitar"
  | "statusRetornar"
  | "statusRejeitou"
  | "statusFinalizado"
  | "statusIgreja";

export interface MapMarkerMeta {
  label: string;
  shortLabel: string;
  icon: ComponentProps<typeof Icon>["name"];
  colorKey: MapMarkerColorKey;
}

/**
 * Metadados visuais dos 5 tipos de marcador do Mapa Missionário.
 * Centraliza rótulo, ícone e cor (chave do tema) usados no pino do
 * mapa, na legenda e nos botões de status do Bottom Sheet.
 */
export const MAP_MARKER_META: Record<MapMarkerType, MapMarkerMeta> = {
  visitar: {
    label: "Família para visitar",
    shortLabel: "Para visitar",
    icon: "home-outline",
    colorKey: "statusVisitar",
  },
  retornar: {
    label: "Família para retornar",
    shortLabel: "Para retornar",
    icon: "reload-outline",
    colorKey: "statusRetornar",
  },
  rejeitou: {
    label: "Família que rejeitou o curso",
    shortLabel: "Rejeitou o curso",
    icon: "close-circle-outline",
    colorKey: "statusRejeitou",
  },
  finalizado: {
    label: "Família com curso finalizado",
    shortLabel: "Curso finalizado",
    icon: "checkmark-circle-outline",
    colorKey: "statusFinalizado",
  },
  igreja: {
    label: "Igreja Adventista",
    shortLabel: "Igreja",
    icon: "business-outline",
    colorKey: "statusIgreja",
  },
};

// Ordem fixa dos botões de status exibidos no Bottom Sheet.
export const FAMILY_STATUS_ORDER: FamilyStatus[] = ["visitar", "retornar", "rejeitou", "finalizado"];

// Tipos disponíveis para criação de marcador (formulário do administrador).
export const CREATABLE_MARKER_TYPES: MapMarkerType[] = [
  "visitar",
  "retornar",
  "rejeitou",
  "finalizado",
  "igreja",
];
