import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DiaryEntry } from "../types";
import { diaryService } from "../services/diaryService";
import { useAuth } from "./AuthContext";

interface DiaryContextValue {
  entriesByDate: Record<string, DiaryEntry>;
  isLoading: boolean;
  getEntry: (date: string) => DiaryEntry | undefined;
  saveEntry: (date: string, content: string) => Promise<void>;
  deleteEntry: (date: string) => Promise<void>;
}

const DiaryContext = createContext<DiaryContextValue | undefined>(undefined);

/**
 * Estado do Diário privado do missionário autenticado. Cada usuário só
 * enxerga seus próprios registros — a lista é recarregada sempre que
 * o usuário muda (login/logout). Nesta etapa os dados são mock,
 * persistidos localmente por usuário via `diaryService`; futuramente
 * passará a consultar o Cloud Firestore sem exigir mudanças aqui.
 */
export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [entriesByDate, setEntriesByDate] = useState<Record<string, DiaryEntry>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntriesByDate({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    diaryService.getAllForUser(user.id).then((all) => {
      const map: Record<string, DiaryEntry> = {};
      all.forEach((entry) => {
        map[entry.date] = entry;
      });
      setEntriesByDate(map);
      setIsLoading(false);
    });
  }, [user?.id]);

  const getEntry = (date: string) => entriesByDate[date];

  const saveEntry = async (date: string, content: string) => {
    if (!user) return;
    const entry = await diaryService.saveEntry(user.id, date, content);
    setEntriesByDate((prev) => ({ ...prev, [date]: entry }));
  };

  const deleteEntry = async (date: string) => {
    if (!user) return;
    await diaryService.deleteEntry(user.id, date);
    setEntriesByDate((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  };

  const value = useMemo(
    () => ({ entriesByDate, isLoading, getEntry, saveEntry, deleteEntry }),
    [entriesByDate, isLoading]
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};

export const useDiary = (): DiaryContextValue => {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error("useDiary deve ser usado dentro de DiaryProvider");
  return ctx;
};
