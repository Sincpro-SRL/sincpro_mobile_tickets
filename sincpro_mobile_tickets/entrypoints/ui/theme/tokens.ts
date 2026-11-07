import { buildThemeFromBrand } from "@sincpro/mobile-ui/theme";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * Tema "Cochabamba": el celeste de la bandera de Cochabamba como marca, con azul profundo y
 * dorado de acento. Los tokens se derivan con `buildThemeFromBrand` de mobile-ui, que calcula
 * contenedores, estados y la tinta legible sobre cada color (contraste WCAG AA).
 */
const CELESTE_COCHABAMBA = "#0EA5E9";
const AZUL_PROFUNDO = "#0C4A6E";
const DORADO = "#F59E0B";

function ticketsTheme(mode: "light" | "dark"): ThemeTokens {
  const theme = buildThemeFromBrand({
    name: `tickets-${mode}`,
    mode,
    brand: CELESTE_COCHABAMBA,
    secondary: AZUL_PROFUNDO,
    accent: DORADO,
  });
  // Encabezados de marca: de azul profundo a celeste, para que el logo y los íconos blancos se lean.
  return {
    ...theme,
    gradient: { ...theme.gradient, primary: [AZUL_PROFUNDO, CELESTE_COCHABAMBA] },
  };
}

export const TICKETS_THEME = ticketsTheme("light");
export const TICKETS_DARK_THEME = ticketsTheme("dark");
