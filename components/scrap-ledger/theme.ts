// Color tokens lifted verbatim from the Scrap Ledger design (oklch values),
// centralized because the same handful of tones repeat across every tab.
export const colors = {
  pageBg: "oklch(0.09 0.004 60)",
  appBg: "oklch(0.15 0.004 60)",
  surface: "oklch(0.20 0.006 60)",
  surfaceInput: "oklch(0.23 0.008 60)",
  surfaceModal: "oklch(0.18 0.006 60)",
  navBg: "oklch(0.13 0.004 60)",

  borderHeader: "oklch(0.28 0.02 70 / 0.35)",
  borderNav: "oklch(0.28 0.02 70 / 0.5)",
  border: "oklch(0.30 0.02 70 / 0.4)",
  borderStrong: "oklch(0.30 0.02 70 / 0.6)",
  borderSoft: "oklch(0.30 0.02 70 / 0.5)",

  text: "oklch(0.95 0.01 80)",
  textDim: "oklch(0.62 0.01 70)",
  textFaint: "oklch(0.55 0.01 70)",

  accent: "oklch(0.78 0.13 85)",
  accentBorder: "oklch(0.78 0.13 85 / 0.35)",
  accentBorderStrong: "oklch(0.78 0.13 85 / 0.6)",
  accentBorderSoft: "oklch(0.78 0.13 85 / 0.5)",
  accentText: "oklch(0.15 0.01 60)",

  danger: "oklch(0.68 0.16 25)",
  dangerSolid: "oklch(0.62 0.16 25)",
  dangerBorder: "oklch(0.62 0.16 25 / 0.5)",
  dangerBorderStrong: "oklch(0.62 0.16 25 / 0.6)",

  overlay: "oklch(0.05 0 0 / 0.7)",
} as const;

export const fonts = {
  display: "'Playfair Display', serif",
  sans: "'Manrope', sans-serif",
} as const;
