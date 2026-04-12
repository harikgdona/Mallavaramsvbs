"use client";

import Image from "next/image";
import { useTranslate, useSiteManual } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { HomeHeroFooterTicker } from "@/components/HomeHeroFooterTicker";

export function Hero() {
  const t = useTranslate();
  const { siteManual: c } = useSiteManual();
  const { language } = useLanguage();
  const heroSrc = c.homeHeroBackgroundSrc.trim();
  const heroBg =
    heroSrc !== ""
      ? resolveGalleryImageSrc(heroSrc, withBasePath("/images/placeholder.svg"))
      : null;

  return (
    <section
      id="home"
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-beige"
      aria-label="Hero section"
    >
      {heroBg ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-beige">
          <Image
            src={heroBg.src}
            alt=""
            fill
            className="object-contain object-top opacity-100"
            priority
            quality={95}
            sizes="100vw"
            unoptimized={heroBg.unoptimized}
            aria-hidden
          />
        </div>
      ) : null}

      {/* Scrim: slightly stronger when full-bleed photo so overlaid text stays readable */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b ${
          heroBg ? "from-white/25 via-white/15 to-beige/65" : "from-white/43 via-white/35 to-beige/92"
        }`}
        aria-hidden
      />
      {heroBg ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_30%,rgba(212,175,55,0.04),transparent_55%)]"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_25%,rgba(212,175,55,0.14),transparent_60%)]"
          aria-hidden
        />
      )}

      <div className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 max-w-6xl shrink-0 flex-col px-4 py-2 sm:px-6 sm:py-4 md:py-6 lg:px-8 lg:py-6">
        <h1 className="mb-1 shrink-0 text-center font-heading text-lg leading-tight text-maroon drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] sm:text-xl lg:text-[1.375rem]">
          {t("hero_heading")}
        </h1>

        <p className="mx-auto w-full min-w-0 max-w-full shrink-0 overflow-x-auto text-center font-heading text-[0.525rem] italic leading-relaxed whitespace-nowrap text-text-dark/90 drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)] [scrollbar-width:none] sm:text-[0.6rem] md:text-[0.6375rem] lg:text-[0.675rem] [&::-webkit-scrollbar]:hidden">
          {language === "te"
            ? "మీరు మద్దతు ఇచ్చే ప్రతి భోజనం వేద పండితులు, పేద బ్రాహ్మణ కుటుంబాలు మరియు మల్లవరం సందర్శించే యాత్రికులతో పంచుకునే ఆశీర్వాదం."
            : "Every meal you support is a blessing shared with Veda pandits, poor Brahmin families, and pilgrims visiting Mallavaram."}
        </p>
      </div>

      <HomeHeroFooterTicker />
    </section>
  );
}
