"use client";

import Image from "next/image";
import { DonationButton } from "@/components/DonationButton";
import { useTranslate, useSiteManual } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { useSectionTabs } from "@/components/SectionTabs";

const HERO_BG_FALLBACK = "/images/Satram-illuminated.jpeg";

export function Hero() {
  const t = useTranslate();
  const { siteManual: c } = useSiteManual();
  const { language } = useLanguage();
  const { setActiveSection } = useSectionTabs();
  const heroBg = resolveGalleryImageSrc(
    c.homeHeroBackgroundSrc.trim() || HERO_BG_FALLBACK,
    withBasePath(HERO_BG_FALLBACK)
  );

  return (
    <section
      id="home"
      className="relative flex flex-1 flex-col overflow-hidden bg-beige"
      aria-label="Hero section"
    >
      {/* Full-viewport background photo (JPEG has no alpha; “transparency” is via opacity + scrim). */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroBg.src}
          alt=""
          fill
          className="object-cover object-center opacity-90"
          priority
          quality={95}
          sizes="100vw"
          unoptimized={heroBg.unoptimized}
          aria-hidden
        />
      </div>

      {/* Light scrim so maroon copy stays readable while the photo shows through. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/60 via-white/45 to-beige/92"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_90%_60%_at_50%_25%,rgba(212,175,55,0.14),transparent_60%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 md:py-12 lg:px-8 lg:py-14">
        <div className="mx-auto min-w-0 max-w-xl break-words text-center text-text-dark lg:mx-0 lg:max-w-none lg:text-left">
          <p className="mb-5 inline-block max-w-full break-words rounded-full border border-maroon/15 bg-white/75 px-4 py-1.5 text-xs tracking-wide text-maroon/90 shadow-sm backdrop-blur-sm md:text-sm">
            Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu
          </p>
          <h1 className="mb-4 break-words font-heading text-3xl leading-tight text-maroon sm:text-4xl lg:text-[2.75rem]">
            {t("hero_heading")}
          </h1>
          <p className="mb-6 break-words text-sm leading-relaxed text-text-dark/85 md:mb-8 md:text-base lg:text-lg">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:justify-start">
            <DonationButton size="large" />
            <button
              type="button"
              onClick={() => setActiveSection("annadanam")}
              className="btn-outline"
            >
              {t("hero_join_annadanam")}
            </button>
          </div>
          <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-text-dark/70 md:text-sm lg:mx-0">
            {language === "te"
              ? "మీరు మద్దతు ఇచ్చే ప్రతి భోజనం వేద పండితులు, పేద బ్రాహ్మణ కుటుంబాలు మరియు మల్లవరం సందర్శించే యాత్రికులతో పంచుకునే ఆశీర్వాదం."
              : "Every meal you support is a blessing shared with Veda pandits, poor Brahmin families, and pilgrims visiting Mallavaram."}
          </p>
        </div>

        <p className="mt-auto pt-6 text-center text-xs text-text-dark/55 md:pt-8 lg:text-left">
          {language === "te"
            ? "శ్రీ మల్లవరం బ్రాహ్మణ సత్రం — సాయంత్రం దర్శనం"
            : "Sri Mallavaram Brahmana Satram — evening darshan"}
        </p>
      </div>
    </section>
  );
}
