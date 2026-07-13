import { Missionary } from "../types";
import { galleryOptionsMock } from "./galleryOptions";

export const missionariesMock: Missionary[] = [
  {
    id: "m1",
    name: "Admin Geral",
    email: "admin@calebe.com",
    role: "admin",
    photoUrl: "https://i.pravatar.cc/300?img=12",
    city: "Porto Feliz - SP",
    age: 30,
    bio: "Coordenador geral da Missão Calebe Porto Feliz 2026.",
    social: { instagram: "https://instagram.com" },
    gallery: [galleryOptionsMock[0], galleryOptionsMock[4]],
  },
  {
    id: "m2",
    name: "Lucas Andrade",
    email: "lucas@calebe.com",
    role: "missionario",
    photoUrl: "https://i.pravatar.cc/300?img=15",
    city: "Porto Feliz - SP",
    age: 19,
    bio: "Servindo a Deus com alegria nas férias no topo.",
    social: { instagram: "https://instagram.com", whatsapp: "https://wa.me/5511999999999" },
    gallery: [galleryOptionsMock[1], galleryOptionsMock[2], galleryOptionsMock[5]],
  },
  {
    id: "m3",
    name: "Maria Eduarda",
    email: "maria@calebe.com",
    role: "missionario",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    city: "Porto Feliz - SP",
    age: 21,
    bio: "Apaixonada por evangelismo e literatura missionária.",
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    gallery: [galleryOptionsMock[3], galleryOptionsMock[6], galleryOptionsMock[7]],
  },
];
