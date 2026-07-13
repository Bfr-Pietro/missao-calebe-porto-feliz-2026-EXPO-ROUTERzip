/**
 * Paleta de cores oficial — Missão Calebe Porto Feliz 2026
 *
 * Extraída da identidade visual de referência (logo e arte de divulgação):
 * verde vibrante de fundo, azul-marinho do brasão/tipografia e amarelo
 * como cor de destaque/selo. Esta paleta é fixa e não deve ser alterada
 * durante o restante do desenvolvimento.
 */

export const palette = {
  // Verde — cor primária da identidade (fundo da arte, destaques)
  green50: "#F1FBE8",
  green100: "#DFF6C6",
  green300: "#A9E870",
  green500: "#7ED321", // verde principal (base da arte de referência)
  green600: "#65B015",
  green700: "#4C8710",

  // Azul-marinho — cor secundária (logo, textos de apoio, contraste)
  navy50: "#EAF1F8",
  navy100: "#C7D8E8",
  navy300: "#5C86AC",
  navy500: "#123A5E", // azul principal do brasão "CALEBE"
  navy700: "#0B2740",
  navy900: "#071A2C",

  // Amarelo — cor de destaque (selos, badges, chamadas de atenção)
  yellow300: "#FFE380",
  yellow500: "#FFC93C", // amarelo do selo "SOU CALEBE"
  yellow700: "#E0A800",

  // Neutros
  white: "#FFFFFF",
  black: "#000000",
  gray50: "#F7F8FA",
  gray100: "#EEF1F4",
  gray200: "#E1E5EA",
  gray300: "#C9CFD6",
  gray400: "#9AA3AD",
  gray500: "#6B7480",
  gray600: "#4A515C",
  gray700: "#333941",
  gray800: "#20242A",
  gray900: "#121417",

  // Semânticas
  success: "#3DBE6C",
  warning: "#FFC93C",
  danger: "#E5484D",
  info: "#3D8EE0",
} as const;

export const lightTheme = {
  mode: "light" as const,
  background: palette.gray50,
  backgroundElevated: palette.white,
  surface: palette.white,
  surfaceMuted: palette.gray100,
  primary: palette.green500,
  primaryPressed: palette.green600,
  secondary: palette.navy500,
  accent: palette.yellow500,
  textPrimary: palette.navy900,
  textSecondary: palette.gray600,
  textInverse: palette.white,
  border: palette.gray200,
  divider: palette.gray200,
  overlay: "rgba(7, 26, 44, 0.55)",
  glassBackground: "rgba(255, 255, 255, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.35)",
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  statusVisitar: palette.info,
  statusRetornar: palette.yellow500,
  statusRejeitou: palette.danger,
  statusFinalizado: palette.success,
  statusIgreja: palette.navy500,
};

export const darkTheme = {
  mode: "dark" as const,
  background: palette.navy900,
  backgroundElevated: palette.navy700,
  surface: palette.navy700,
  surfaceMuted: palette.navy500,
  primary: palette.green500,
  primaryPressed: palette.green300,
  secondary: palette.green300,
  accent: palette.yellow500,
  textPrimary: palette.white,
  textSecondary: palette.gray300,
  textInverse: palette.navy900,
  border: "rgba(255,255,255,0.12)",
  divider: "rgba(255,255,255,0.12)",
  overlay: "rgba(0, 0, 0, 0.65)",
  glassBackground: "rgba(18, 58, 94, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  statusVisitar: palette.info,
  statusRetornar: palette.yellow500,
  statusRejeitou: palette.danger,
  statusFinalizado: palette.success,
  statusIgreja: palette.green300,
};

export type AppTheme = typeof lightTheme | typeof darkTheme;
