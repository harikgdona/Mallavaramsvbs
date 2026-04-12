"use client";

import { useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";

/** One color per `•`-separated segment (date + program, header, or transport note). */
const TICKER_SEGMENT_COLORS = [
  "#7B1E1E",
  "#047857",
  "#1D4ED8",
  "#B45309",
  "#7C3AED",
  "#BE123C",
  "#0D9488",
  "#4338CA",
  "#A16207",
  "#0F766E",
  "#6D28D9",
  "#15803D",
  "#C2410C",
  "#4F46E5",
  "#D4AF37",
  "#9D174D",
  "#0369A1",
  "#65A30D"
];

function ColoredTickerLine({ text }: { text: string }) {
  const segments = text
    .split("•")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (segments.length === 0) {
    return (
      <span className="whitespace-nowrap font-heading text-xs leading-snug text-text-dark/90 sm:text-sm">—</span>
    );
  }

  return (
    <span className="inline-flex flex-row flex-nowrap items-baseline whitespace-nowrap font-heading text-sm leading-snug sm:text-base md:text-lg">
      {segments.map((segment, i) => (
        <span key={i} className="inline-flex shrink-0 flex-nowrap items-baseline">
          {i > 0 ? (
            <span className="mx-1.5 shrink-0 text-text-dark/35 select-none" aria-hidden>
              •
            </span>
          ) : null}
          <span
            style={{ color: TICKER_SEGMENT_COLORS[i % TICKER_SEGMENT_COLORS.length] }}
            className="shrink-0 font-semibold animate-ticker-flicker"
          >
            {segment}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Full-width scrolling strip at the bottom of the home hero (Brahmotsavam schedule + transport note). */
export function HomeHeroFooterTicker() {
  const t = useTranslate();
  const { language } = useLanguage();
  const messageRaw = t("home_brahmotsavam_ticker");
  const message = messageRaw.trim().length > 0 ? messageRaw : "—";

  return (
    <div
      className="home-hero-footer-ticker-shell relative z-20 w-full shrink-0 overflow-hidden border-t border-maroon/20 bg-gradient-to-r from-white/95 via-sandal/92 to-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      role="region"
      aria-label={language === "te" ? "బ్రహ్మోత్సవ కార్యక్రమములు" : "Brahmotsavam programs and announcements"}
    >
      <div className="home-hero-footer-marquee-track flex min-h-[2.25rem] items-center py-1.5 sm:py-2">
        <div className="flex shrink-0 items-center px-8 md:px-12">
          <ColoredTickerLine text={message} />
        </div>
        <div className="flex shrink-0 items-center px-8 md:px-12" aria-hidden>
          <ColoredTickerLine text={message} />
        </div>
      </div>
    </div>
  );
}
