"use client";

import { useTranslate } from "@/components/ConfigProvider";
import { useSectionTabs } from "@/components/SectionTabs";
import { useLanguage } from "@/components/LanguageProvider";

const WORD_COLORS = [
  "#7B1E1E",
  "#D4AF37",
  "#047857",
  "#1D4ED8",
  "#B45309",
  "#7C3AED",
  "#BE123C",
  "#0D9488",
  "#C2410C",
  "#4338CA"
];

function RainbowWords({ text }: { text: string }) {
  const tokens = text.split(/(\s+)/).filter(Boolean);
  let colorIndex = 0;
  return (
    <>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={i}>{token}</span>;
        }
        const color = WORD_COLORS[colorIndex % WORD_COLORS.length];
        colorIndex += 1;
        return (
          <span
            key={i}
            style={{ color }}
            className="font-heading text-sm font-semibold whitespace-nowrap md:text-[0.95rem] leading-tight"
          >
            {token}
          </span>
        );
      })}
    </>
  );
}

/**
 * Horizontal ticker in the main column only (starts after the left sidebar on desktop).
 * Visible on the Home section: 50px-tall strip, 5px below the header block, multicolor words, scrolls left → right.
 */
export function LiveFeedStrip() {
  const t = useTranslate();
  const { activeSection } = useSectionTabs();
  const { language } = useLanguage();

  if (activeSection !== "home") return null;

  const message = t("live_feed_text").trim() || "—";

  return (
    <div
      className="live-feed-strip-shell relative z-10 mt-[5px] h-[50px] w-full max-w-full shrink-0 overflow-hidden border-y border-maroon/20 bg-gradient-to-r from-white/95 via-sandal/90 to-white/95 shadow-sm"
      role="region"
      aria-label={language === "te" ? "లైవ్ ఫీడ్" : "Live feed"}
    >
      <div className="live-feed-marquee-track flex h-[50px] items-center">
        <div className="flex shrink-0 items-center px-6 md:px-8">
          <RainbowWords text={message} />
        </div>
        <div className="flex shrink-0 items-center px-6 md:px-8" aria-hidden>
          <RainbowWords text={message} />
        </div>
      </div>
    </div>
  );
}
