import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

/**
 * ============================================================================
 * TICKETS DOMAIN - THEME TOKENS
 * ============================================================================
 *
 * Tema "Cochabamba" - celeste de la bandera de Cochabamba (Bolivia) como color
 * principal, con acentos diferenciados (azul profundo + dorado) para resaltar.
 */

export const TICKETS_THEME: ThemeTokens = {
  name: "tickets",

  // Colores primarios (celeste Cochabamba + acentos)
  primary: "#0EA5E9", // sky-500 - celeste bandera de Cochabamba
  secondary: "#0C4A6E", // sky-900 - azul profundo, contraste serio
  accent: "#F59E0B", // amber-500 - dorado cálido para CTAs/badges

  // Fondos (claros con un matiz celeste)
  bg: {
    page: "#F0F9FF", // sky-50 - fondo con tinte celeste muy sutil
    card: "#FFFFFF", // Blanco puro - cards resaltan
    popover: "#FFFFFF", // Blanco puro
    muted: "#E0F2FE", // sky-100 - superficies secundarias celestes
    accent: "#BAE6FD", // sky-200 - estados seleccionados celestes
    hover: "#E0F2FE", // sky-100 - hover celeste sutil
    disabled: "#F1F5F9", // slate-100 - disabled
  },

  // Textos (oscuros sobre claro)
  text: {
    primary: "#0F172A", // slate-900 - foreground principal
    secondary: "#475569", // slate-600 - texto secundario
    tertiary: "#94A3B8", // slate-400 - placeholders
    muted: "#64748B", // slate-500 - texto sobre bg.muted
    accent: "#075985", // sky-800 - texto sobre bg.accent celeste
    inverse: "#FFFFFF", // Blanco - texto sobre colores
    disabled: "#94A3B8", // slate-400 - disabled
    onPrimary: "#FFFFFF", // Blanco sobre primary (celeste)
    onSecondary: "#FFFFFF", // Blanco sobre secondary (azul profundo)
    onAccent: "#FFFFFF", // Blanco sobre accent (dorado)
    onDanger: "#FFFFFF", // Blanco sobre rojo
    onSuccess: "#FFFFFF", // Blanco sobre verde
  },

  // Iconos (oscuros sobre claro)
  icon: {
    primary: "#0F172A", // slate-900
    secondary: "#64748B", // slate-500
    tertiary: "#94A3B8", // slate-400
    inverse: "#FFFFFF", // Blanco
    disabled: "#CBD5E1", // slate-300
  },

  // Bordes (sutiles, con focus celeste)
  border: {
    default: "#E2E8F0", // slate-200 - bordes sutiles
    light: "#F1F5F9", // slate-100 - bordes muy sutiles
    strong: "#CBD5E1", // slate-300 - bordes fuertes
    focus: "#0EA5E9", // sky-500 - focus ring celeste
  },

  // Estados semánticos
  success: "#16A34A", // green-600
  warning: "#F59E0B", // amber-500
  danger: "#DC2626", // red-600
  info: "#0EA5E9", // sky-500 (usa primary celeste)

  // Estados semánticos - Versiones claras
  successLight: "#DCFCE7", // green-100
  warningLight: "#FEF3C7", // amber-100
  dangerLight: "#FEE2E2", // red-100
  infoLight: "#E0F2FE", // sky-100

  // Focus & Input
  ring: "#0EA5E9", // sky-500 - celeste
  input: "#E2E8F0", // slate-200

  // Gradientes (celeste casi plano: salto sutil entre los dos tonos)
  gradient: {
    primary: ["#38BDF8", "#0EA5E9"], // sky-400 → sky-500 (degradé muy sutil)
    accent: ["#F59E0B", "#D97706"], // amber-500 → amber-600 (dorado)
  },

  // Sombras (light theme - sutiles)
  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
  },
};
