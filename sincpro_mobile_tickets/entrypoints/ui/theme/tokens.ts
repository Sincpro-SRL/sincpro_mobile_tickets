import type { ThemeTokens } from "@sincpro/mobile-ui/theme/types";

// ── LIGHT THEME ──────────────────────────────────────────────────────────────
// Palette from design handoff — 5 base colors:
//   #00313C  primary   · Navy      (Pantone 547 C)
//   #4698CA  secondary · Light blue (Pantone 7688 C)
//   #E8883A  accent    · Amber CTA
//   #F6F9FA  surface   · Paper/muted
//   #14242E  ink       · Dark text
export const TICKETS_THEME: ThemeTokens = {
  name: "tickets",

  primary: "#00313C", // navy · main buttons, headings
  secondary: "#4698CA", // light blue · links, secondary actions
  accent: "#E8883A", // amber · CTA, focus rings, active states

  bg: {
    page: "#F2F6F9", // cool blue-tint — white cards visually lift from this
    card: "#FFFFFF",
    popover: "#FFFFFF",
    muted: "#E8EFF4", // slightly deeper tint for alternate sections
    accent: "#FEF1E6", // amber-tinted selected surface — matches accent color
    hover: "#EBF2F7",
    disabled: "#EDF2F5",
  },

  text: {
    primary: "#14242E", // dark ink
    secondary: "#00313C", // navy
    tertiary: "#4698CA", // light blue
    muted: "#4698CA",
    accent: "#B5601A", // darkened amber — readable on light bg
    inverse: "#FFFFFF",
    disabled: "#9CA3AF",
    onPrimary: "#FFFFFF", // white on navy
    onSecondary: "#14242E",
    onAccent: "#FFFFFF", // white on amber
    onDanger: "#FFFFFF",
    onSuccess: "#FFFFFF",
  },

  icon: {
    primary: "#00313C",
    secondary: "#4698CA",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
    disabled: "#CBD5E1",
  },

  border: {
    default: "#D0DFE9", // more defined against #F2F6F9 page bg
    light: "#E8EFF4",
    strong: "#4698CA",
    focus: "#E8883A", // amber focus ring
  },

  success: "#1B7A4A",
  warning: "#E8883A", // amber = CTA = warning action
  danger: "#C0392B",
  info: "#4698CA", // light blue

  successLight: "#D4EDE0",
  warningLight: "#FDF0E4",
  dangerLight: "#FADBD8",
  infoLight: "#EAF2F7",

  ring: "#E8883A",
  input: "#EAF2F7",

  gradient: {
    primary: ["#14242E", "#00313C"], // ink → navy
    accent: ["#C96A1A", "#E8883A"], // dark amber → amber
  },

  shadow: {
    sm: {
      shadowColor: "#00313C",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#00313C",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#00313C",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 5,
    },
  },
};

// ── DARK THEME ────────────────────────────────────────────────────────────────
// Based on CC4 (Navy) + CC5 (Hero): dark navy background, light text,
// amber CTA unchanged. Links shift to #9FD0EC (lighter blue for dark surfaces).
export const TICKETS_DARK_THEME: ThemeTokens = {
  name: "tickets-dark",

  primary: "#EAF2F7", // light text on dark surface
  secondary: "#9FD0EC", // lighter blue — CC5 links
  accent: "#E8883A", // amber stays — same CTA across modes

  bg: {
    page: "#00313C", // CC4/CC5 · navy dark base
    card: "#14242E", // darker ink
    popover: "#14242E",
    muted: "#14242E",
    accent: "#1A4A58", // slightly lighter navy — selected surface
    hover: "#14242E",
    disabled: "#0D1F28",
  },

  text: {
    primary: "#EAF2F7",
    secondary: "#9FD0EC",
    tertiary: "#4698CA",
    muted: "#9FD0EC",
    accent: "#E8883A", // amber on dark — good contrast
    inverse: "#00313C",
    disabled: "#3A4F58",
    onPrimary: "#00313C", // dark on light button
    onSecondary: "#EAF2F7",
    onAccent: "#FFFFFF",
    onDanger: "#FFFFFF",
    onSuccess: "#FFFFFF",
  },

  icon: {
    primary: "#EAF2F7",
    secondary: "#9FD0EC",
    tertiary: "#4698CA",
    inverse: "#00313C",
    disabled: "#3A4F58",
  },

  border: {
    default: "#1A4A58",
    light: "#14242E",
    strong: "#4698CA",
    focus: "#E8883A",
  },

  success: "#2EAE6E",
  warning: "#E8883A",
  danger: "#E74C3C",
  info: "#4698CA",

  successLight: "#0D3525",
  warningLight: "#3D2008",
  dangerLight: "#3D0D0D",
  infoLight: "#0D2535",

  ring: "#E8883A",
  input: "#1A4A58",

  gradient: {
    primary: ["#1A3A48", "#00313C"],
    accent: ["#C96A1A", "#E8883A"],
  },

  shadow: {
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 5,
    },
  },
};
