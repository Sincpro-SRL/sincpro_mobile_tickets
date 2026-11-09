import {
  containerPair,
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  mergeTheme,
  resolveOnColor,
} from "@sincpro/mobile-ui/theme";
import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * Mi Tren (Tren Metropolitano de Cochabamba), negro y dorado. En claro el negro lleva la
 * navegación y los enlaces y el dorado rellena las acciones; en oscuro el dorado pasa a ser el
 * color principal. Los encabezados de marca son negros en los dos modos, con el logo dorado.
 * El ícono y el splash (`app.json`) usan el mismo negro.
 */
const INK = "#1A1714";
const NIGHT = "#0B0A09";
const GOLD = "#C89B3C";
const GOLD_LIGHT = "#E2BE6E";
const HEADER: readonly [string, string] = [NIGHT, "#2B2723"];

const ink = containerPair(INK, "light");
const night = containerPair(NIGHT, "light");
const gold = containerPair(GOLD, "dark");
const goldLight = containerPair(GOLD_LIGHT, "dark");

export const TICKETS_THEME: ThemeTokens = mergeTheme(DEFAULT_THEME, {
  name: "mi-tren-light",
  primary: INK,
  secondary: NIGHT,
  bg: { accent: ink.container },
  text: { accent: INK, onPrimary: "#FFFFFF", onSecondary: "#FFFFFF" },
  border: { focus: INK },
  ring: INK,
  container: {
    primary: ink.container,
    onPrimary: ink.onContainer,
    secondary: night.container,
    onSecondary: night.onContainer,
  },
  gradient: { primary: HEADER },
});

export const TICKETS_DARK_THEME: ThemeTokens = mergeTheme(DEFAULT_DARK_THEME, {
  name: "mi-tren-dark",
  primary: GOLD,
  secondary: GOLD_LIGHT,
  bg: { accent: gold.container },
  text: {
    accent: GOLD_LIGHT,
    onPrimary: resolveOnColor(GOLD),
    onSecondary: resolveOnColor(GOLD_LIGHT),
  },
  border: { focus: GOLD_LIGHT },
  ring: GOLD_LIGHT,
  container: {
    primary: gold.container,
    onPrimary: gold.onContainer,
    secondary: goldLight.container,
    onSecondary: goldLight.onContainer,
  },
  gradient: { primary: ["#000000", "#1F1C19"] },
});
