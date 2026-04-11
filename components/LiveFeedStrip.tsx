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
    <span className="inline-flex flex-none flex-row flex-nowrap items-baseline">
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={i} className="shrink-0 whitespace-pre">
              {token}
            </span>
          );
        }
        const color = WORD_COLORS[colorIndex % WORD_COLORS.length];
        colorIndex += 1;
        return (
          <span
            key={i}
            style={{ color }}
            className="shrink-0 font-heading text-sm font-semibold whitespace-nowrap md:text-[0.95rem] leading-tight"
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Horizontal ticker in the main column only (starts after the left sidebar on desktop).
 * Visible on the Home section: 45px-tall strip (~10% shorter than prior 50px), 5px below the header block; scrolls left → right.
 */
export function LiveFeedStrip() {
  const t = useTranslate();
  const { activeSection } = useSectionTabs();
  const { language } = useLanguage();

  if (activeSection !== "home") return null;

  const messageRaw = t("live_feed_text");
  const message = messageRaw.length > 0 ? messageRaw : "—";

  return (
    <div
      className="live-feed-strip-shell relative z-10 mt-[5px] h-[45px] w-full max-w-full shrink-0 overflow-hidden border-y border-maroon/20 bg-gradient-to-r from-white/95 via-sandal/90 to-white/95 shadow-sm"
      role="region"
      aria-label={language === "te" ? "లైవ్ ఫీడ్" : "Live feed"}
    >
      <div className="live-feed-marquee-track flex h-[45px] items-center">
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
