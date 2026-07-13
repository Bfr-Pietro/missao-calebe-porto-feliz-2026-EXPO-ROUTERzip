import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Missionary } from "../types";
import { missionaryService } from "../services/missionaryService";

interface MissionaryContextValue {
  missionaries: Missionary[];
  isLoading: boolean;
  getById: (id: string) => Missionary | undefined;
  updateProfile: (id: string, changes: Partial<Missionary>) => Promise<void>;
}

const MissionaryContext = createContext<MissionaryContextValue | undefined>(undefined);

/**
 * Estado compartilhado dos missionários. Alimenta tanto a Home pública
 * (carrossel, telas de detalhe) quanto a Área Interna (lista, perfil,
 * edição), garantindo que uma edição de perfil seja refletida
 * imediatamente na página pública. Nesta etapa os dados são mock,
 * persistidos localmente; futuramente `missionaryService` passará a
 * consultar o Cloud Firestore sem exigir mudanças aqui.
 */
export const MissionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    missionaryService.getAll().then((all) => {
      setMissionaries(all);
      setIsLoading(false);
    });
  }, []);

  const getById = (id: string) => missionaries.find((item) => item.id === id);

  const updateProfile = async (id: string, changes: Partial<Missionary>) => {
    const updated = await missionaryService.update(id, changes);
    setMissionaries((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const value = useMemo(
    () => ({ missionaries, isLoading, getById, updateProfile }),
    [missionaries, isLoading]
  );

  return <MissionaryContext.Provider value={value}>{children}</MissionaryContext.Provider>;
};

export const useMissionaries = (): MissionaryContextValue => {
  const ctx = useContext(MissionaryContext);
  if (!ctx) throw new Error("useMissionaries deve ser usado dentro de MissionaryProvider");
  return ctx;
};
