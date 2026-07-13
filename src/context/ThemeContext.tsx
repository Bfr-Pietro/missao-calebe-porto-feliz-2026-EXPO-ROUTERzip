import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { AppTheme, darkTheme, lightTheme } from "../theme/colors";
import { storageService } from "../services/storageService";
import { STORAGE_KEYS } from "../constants";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    storageService.getItem<ThemeMode>(STORAGE_KEYS.themeMode).then((saved) => {
      if (saved) setModeState(saved);
      setReady(true);
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    storageService.setItem(STORAGE_KEYS.themeMode, next);
  };

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => setMode(isDark ? "light" : "dark");

  const value = useMemo(
    () => ({ theme, mode, isDark, setMode, toggleTheme }),
    [theme, mode, isDark]
  );

  if (!ready) return null;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme deve ser usado dentro de ThemeProvider");
  return ctx;
};
