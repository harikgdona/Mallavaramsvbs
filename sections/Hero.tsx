"use client";

import Image from "next/image";
import { useTranslate, useSiteManual } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";

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
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={heroBg.src}
            alt=""
            fill
            className="object-cover object-center opacity-100"
            priority
            quality={95}
            sizes="100vw"
            unoptimized={heroBg.unoptimized}
            aria-hidden
          />
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b to-beige/92 ${
          heroBg ? "from-white/30 via-white/25" : "from-white/43 via-white/35"
        }`}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_25%,rgba(212,175,55,0.07),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 md:py-12 lg:px-8 lg:py-12">
        {/* Shifted up 40px; ~50% of original hero heading scale */}
        <h1 className="-mt-[40px] mb-2 shrink-0 text-center font-heading text-lg leading-tight text-maroon sm:text-xl lg:text-[1.375rem]">
          {t("hero_heading")}
        </h1>

        {/* ~60% of text-sm / md:text-base / lg:text-lg (40% reduction); stacked under heading */}
        <p className="mx-auto max-w-xl shrink-0 break-words text-center text-[0.525rem] leading-relaxed text-text-dark/85 sm:text-[0.6rem] md:text-[0.6375rem] lg:text-[0.675rem]">
          {language === "te"
            ? "మీరు మద్దతు ఇచ్చే ప్రతి భోజనం వేద పండితులు, పేద బ్రాహ్మణ కుటుంబాలు మరియు మల్లవరం సందర్శించే యాత్రికులతో పంచుకునే ఆశీర్వాదం."
            : "Every meal you support is a blessing shared with Veda pandits, poor Brahmin families, and pilgrims visiting Mallavaram."}
        </p>

        <div className="min-h-0 flex-1" aria-hidden />

        {/* 40px gap before footer blurb */}
        <div className="h-10 shrink-0" aria-hidden />

        <p className="shrink-0 border-t border-maroon/10 pt-4 text-center text-[0.65625rem] leading-relaxed text-text-dark/80 sm:text-[0.75rem] md:pt-5 md:text-[0.8125rem] lg:text-[0.84375rem]">
          {t("hero_subtitle")}
        </p>
      </div>
    </section>
  );
}
