/**
 * Escala tipográfica do aplicativo.
 * Usa a fonte padrão do sistema por enquanto; espaço reservado para
 * futura fonte customizada (ex: uma fonte de destaque tipo "rótulo"
 * para títulos, alinhada ao estilo manuscrito visto na arte de referência).
 */

export const fontFamily = {
  regular: "System",
  medium: "System",
  semibold: "System",
  bold: "System",
  display: "System", // reservado para fonte de display customizada
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  display: 32,
  hero: 40,
};

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 28,
  xxl: 32,
  display: 40,
  hero: 48,
};

export const fontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const typography = {
  hero: { fontSize: fontSize.hero, lineHeight: lineHeight.hero, fontWeight: fontWeight.extrabold },
  display: { fontSize: fontSize.display, lineHeight: lineHeight.display, fontWeight: fontWeight.bold },
  h1: { fontSize: fontSize.xxl, lineHeight: lineHeight.xxl, fontWeight: fontWeight.bold },
  h2: { fontSize: fontSize.xl, lineHeight: lineHeight.xl, fontWeight: fontWeight.semibold },
  h3: { fontSize: fontSize.lg, lineHeight: lineHeight.lg, fontWeight: fontWeight.semibold },
  bodyLg: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontWeight: fontWeight.regular },
  body: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: fontWeight.regular },
  caption: { fontSize: fontSize.xs, lineHeight: lineHeight.xs, fontWeight: fontWeight.medium },
  button: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontWeight: fontWeight.semibold },
};
