import { MapMarkerData } from "../types";
import { churchesMock } from "./churches";

/**
 * Marcadores de família, cobrindo os 4 status definidos no escopo.
 */
const familyMarkersMock: MapMarkerData[] = [
  {
    id: "f1",
    type: "visitar",
    familyName: "Família Silva",
    address: "Rua das Palmeiras, 120 - Porto Feliz",
    notes: "Primeira visita agendada.",
    latitude: -23.1998,
    longitude: -47.5288,
  },
  {
    id: "f2",
    type: "retornar",
    familyName: "Família Costa",
    address: "Rua São João, 45 - Porto Feliz",
    notes: "Pediram para retornar na próxima semana.",
    latitude: -23.2021,
    longitude: -47.5255,
  },
  {
    id: "f3",
    type: "rejeitou",
    familyName: "Família Oliveira",
    address: "Av. Independência, 780 - Porto Feliz",
    notes: "Não demonstrou interesse em continuar o curso bíblico.",
    latitude: -23.1965,
    longitude: -47.5241,
  },
  {
    id: "f4",
    type: "finalizado",
    familyName: "Família Pereira",
    address: "Rua Bahia, 310 - Porto Feliz",
    notes: "Concluiu o curso bíblico com estudo de decisão.",
    latitude: -23.2044,
    longitude: -47.5301,
  },
  {
    id: "f5",
    type: "visitar",
    familyName: "Família Rodrigues",
    address: "Rua Minas Gerais, 88 - Porto Feliz",
    notes: "Indicação de um membro da igreja.",
    latitude: -23.1979,
    longitude: -47.5327,
  },
  {
    id: "f6",
    type: "retornar",
    familyName: "Família Almeida",
    address: "Rua Rio Branco, 210 - Porto Feliz",
    notes: "Interessados, aguardando disponibilidade da família.",
    latitude: -23.2058,
    longitude: -47.5219,
  },
];

/**
 * Marcadores de igreja, derivados de `churchesMock` para que o Mapa
 * Missionário e a Home pública compartilhem a mesma fonte de
 * localização das Igrejas Adventistas de Porto Feliz.
 */
const churchMarkersMock: MapMarkerData[] = churchesMock.map((church) => ({
  id: `church-${church.id}`,
  type: "igreja",
  familyName: church.name,
  address: church.address,
  latitude: church.latitude,
  longitude: church.longitude,
}));

export const mapMarkersMock: MapMarkerData[] = [...familyMarkersMock, ...churchMarkersMock];
