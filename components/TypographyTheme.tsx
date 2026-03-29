"use client";

import { useEffect } from "react";
import { useSiteManual } from "@/components/ConfigProvider";
import { sectionHeadingFontSizeCss } from "@/lib/siteManualSchema";

/** Pushes site manual typography into CSS variables + html font size (saved with layout). */
export function TypographyTheme() {
  const { siteManual: c } = useSiteManual();

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--app-font-body", c.typographyBodyFontFamily);
    r.style.setProperty("--app-font-heading", c.typographyHeadingFontFamily);
    r.style.setProperty("--app-font-nav", c.typographyNavFontFamily);
    r.style.setProperty("--app-font-body-weight", String(c.typographyBodyFontWeight));
    r.style.setProperty("--app-font-heading-weight", String(c.typographyHeadingFontWeight));
    r.style.setProperty("--app-font-nav-weight", String(c.typographyNavFontWeight));
    r.style.setProperty("--app-font-body-style", c.typographyBodyFontStyle);
    r.style.setProperty("--app-font-heading-style", c.typographyHeadingFontStyle);
    r.style.setProperty("--app-font-nav-style", c.typographyNavFontStyle);
    r.style.setProperty("--app-section-heading-size", sectionHeadingFontSizeCss(c));
    r.style.setProperty("--app-section-subtitle-size", `${c.typographySectionSubtitleRem}rem`);
    r.style.fontSize = `${c.typographyHtmlFontPx}px`;
  }, [c]);

  return null;
}
