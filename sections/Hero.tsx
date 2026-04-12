"use client";

import Image from "next/image";
import { useTranslate, useSiteManual } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { useSectionTabs } from "@/components/SectionTabs";
import { HomeHeroFooterTicker } from "@/components/HomeHeroFooterTicker";

export function Hero() {
  const t = useTranslate();
  const { siteManual: c } = useSiteManual();
  const { language } = useLanguage();
  const { setActiveSection } = useSectionTabs();
  const heroSrc = c.homeHeroBackgroundSrc.trim();
  const heroBg =
    heroSrc !== ""
      ? resolveGalleryImageSrc(heroSrc, withBasePath("/images/placeholder.svg"))
      : null;

  return (
    <section
      id="home"
      className="relative flex flex-col bg-beige"
      aria-label="Hero section"
    >
      {/* Heading */}
      <div className="px-4 py-2 text-center">
        <h1 className="font-heading text-lg leading-tight text-maroon sm:text-xl lg:text-2xl">
          {t("hero_heading")}
        </h1>
        <p className="mt-1 text-[0.6rem] italic text-text-dark/80 sm:text-xs">
          {language === "te"
            ? "మీరు మద్దతు ఇచ్చే ప్రతి భోజనం వేద పండితులు, పేద బ్రాహ్మణ కుటుంబాలు మరియు మల్లవరం సందర్శించే యాత్రికులతో పంచుకునే ఆశీర్వాదం."
            : "Every meal you support is a blessing shared with Veda pandits, poor Brahmin families, and pilgrims visiting Mallavaram."}
        </p>
      </div>

      {/* Poster image — inline, not background */}
      {heroBg ? (
        <div className="relative w-full flex-1 min-h-0">
          <img
            src={heroBg.src}
            alt="Sri Mallavaram Brahmana Satram"
            className="w-full h-full object-contain object-top"
          />
        </div>
      ) : null}

      {/* Footer ticker */}
      <HomeHeroFooterTicker />
    </section>
  );
}
