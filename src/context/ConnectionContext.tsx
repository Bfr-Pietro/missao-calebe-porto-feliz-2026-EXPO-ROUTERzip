import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { syncService } from "../services/syncService";

interface ConnectionContextValue {
  isOnline: boolean;
  lastSyncedAt: string | null;
  setOnlineStatus: (online: boolean) => void;
  syncNow: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

/**
 * Simula o estado de conectividade e sincronização.
 * Em uma etapa futura, isOnline passará a ser alimentado por
 * NetInfo e syncNow acionará a sincronização real com o Firestore.
 */
export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    syncService.getLastSync().then(setLastSyncedAt);
  }, []);

  const syncNow = async () => {
    const timestamp = await syncService.syncNow();
    setLastSyncedAt(timestamp);
  };

  const value = useMemo(
    () => ({ isOnline, lastSyncedAt, setOnlineStatus: setIsOnline, syncNow }),
    [isOnline, lastSyncedAt]
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};

export const useConnection = (): ConnectionContextValue => {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection deve ser usado dentro de ConnectionProvider");
  return ctx;
};
