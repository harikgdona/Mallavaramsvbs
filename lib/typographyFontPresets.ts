/**
 * Popular web fonts for Configure presets. Inter + Playfair load via next/font (CSS variables).
 * Other families load from Google Fonts — see TYPOGRAPHY_PRESET_GOOGLE_FONTS_STYLESHEET in layout <head>.
 */

export const TYPOGRAPHY_PRESET_GOOGLE_FONTS_STYLESHEET =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Lato:wght@400;700",
    "family=Libre+Baskerville:wght@400;700",
    "family=Lora:wght@400;600;700",
    "family=Merriweather:wght@400;700",
    "family=Montserrat:wght@400;600;700",
    "family=Noto+Sans:wght@400;600;700",
    "family=Open+Sans:wght@400;600;700",
    "family=Oswald:wght@400;600;700",
    "family=Poppins:wght@400;600;700",
    "family=Roboto:wght@400;600;700",
    "family=Source+Sans+3:wght@400;600;700"
  ].join("&") +
  "&display=swap";

export type TypographyFontPreset = {
  /** Short label in the UI */
  label: string;
  /** Stored in site manual / applied as CSS font-family */
  familyCss: string;
};

/** Ten common choices for body / UI text */
export const POPULAR_BODY_FONTS: readonly TypographyFontPreset[] = [
  { label: "Inter (site default)", familyCss: "var(--font-site-body), system-ui, sans-serif" },
  { label: "Roboto", familyCss: "'Roboto', system-ui, sans-serif" },
  { label: "Open Sans", familyCss: "'Open Sans', system-ui, sans-serif" },
  { label: "Lato", familyCss: "'Lato', system-ui, sans-serif" },
  { label: "Source Sans 3", familyCss: "'Source Sans 3', system-ui, sans-serif" },
  { label: "Noto Sans", familyCss: "'Noto Sans', system-ui, sans-serif" },
  { label: "Poppins", familyCss: "'Poppins', system-ui, sans-serif" },
  { label: "Merriweather", familyCss: "'Merriweather', Georgia, serif" },
  { label: "Georgia", familyCss: "Georgia, 'Times New Roman', serif" },
  { label: "System UI", familyCss: "system-ui, -apple-system, 'Segoe UI', sans-serif" }
] as const;

/** Ten common choices for titles / headings */
export const POPULAR_HEADING_FONTS: readonly TypographyFontPreset[] = [
  { label: "Playfair Display (site default)", familyCss: "var(--font-site-heading), Georgia, serif" },
  { label: "Merriweather", familyCss: "'Merriweather', Georgia, serif" },
  { label: "Lora", familyCss: "'Lora', Georgia, serif" },
  { label: "Libre Baskerville", familyCss: "'Libre Baskerville', Georgia, serif" },
  { label: "Georgia", familyCss: "Georgia, 'Times New Roman', serif" },
  { label: "Montserrat", familyCss: "'Montserrat', system-ui, sans-serif" },
  { label: "Poppins", familyCss: "'Poppins', system-ui, sans-serif" },
  { label: "Oswald", familyCss: "'Oswald', system-ui, sans-serif" },
  { label: "Roboto", familyCss: "'Roboto', system-ui, sans-serif" },
  { label: "Lato", familyCss: "'Lato', system-ui, sans-serif" }
] as const;

/** Loose match for highlighting the active preset when the user edited the CSS string slightly */
export function familyCssMatchesPreset(current: string, presetFamilyCss: string): boolean {
  const n = (s: string) =>
    s
      .replace(/\s*,\s*/g, ",")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  return n(current) === n(presetFamilyCss);
}
