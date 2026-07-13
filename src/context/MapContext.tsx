import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MapMarkerData, MapMarkerType } from "../types";
import { mapService } from "../services/mapService";

interface MapContextValue {
  markers: MapMarkerData[];
  isLoading: boolean;
  updateStatus: (id: string, type: MapMarkerType) => Promise<void>;
  createMarker: (marker: Omit<MapMarkerData, "id">) => Promise<void>;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

/**
 * Estado compartilhado dos marcadores do Mapa Missionário. Mantém a
 * lista de famílias e igrejas, permitindo que qualquer missionário
 * altere o status de uma família (tocando nos botões do Bottom Sheet)
 * e que o administrador crie novos marcadores. Nesta etapa os dados
 * são mock, persistidos localmente; futuramente `mapService` passará
 * a consultar o Cloud Firestore sem exigir mudanças aqui.
 */
export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MapMarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mapService.getAll().then((all) => {
      setMarkers(all);
      setIsLoading(false);
    });
  }, []);

  const updateStatus = async (id: string, type: MapMarkerType) => {
    const updated = await mapService.updateStatus(id, type);
    setMarkers((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const createMarker = async (marker: Omit<MapMarkerData, "id">) => {
    const created = await mapService.create(marker);
    setMarkers((prev) => [...prev, created]);
  };

  const value = useMemo(
    () => ({ markers, isLoading, updateStatus, createMarker }),
    [markers, isLoading]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapMarkers = (): MapContextValue => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapMarkers deve ser usado dentro de MapProvider");
  return ctx;
};
