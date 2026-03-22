"use client";

import Image from "next/image";
import { DonationButton } from "@/components/DonationButton";
import { useTranslate } from "@/components/ConfigProvider";
import { withBasePath } from "@/lib/basePath";

export function Hero() {
  const t = useTranslate();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-sandal/80 via-beige to-beige"
      aria-label="Hero section"
    >
      {/* Decorative wash — no overlap with copy */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(212,175,55,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_minmax(280px,420px)] gap-10 lg:gap-14 items-center">
          {/* Copy first on all breakpoints for clear hierarchy */}
          <div className="text-text-dark text-center lg:text-left max-w-xl mx-auto lg:mx-0 lg:max-w-none">
            <p className="inline-block rounded-full border border-maroon/15 bg-white/70 backdrop-blur-sm px-4 py-1.5 text-xs md:text-sm tracking-wide text-maroon/90 shadow-sm mb-5">
              Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight text-maroon mb-4">
              <span className="block">Serving Dharma.</span>
              <span className="block mt-1 text-text-dark text-[0.92em] font-normal">
                Supporting Brahmin Families.
              </span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-text-dark/80 mb-6 md:mb-8 leading-relaxed">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
              <DonationButton size="large" />
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("annadanam");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="btn-outline"
              >
                {t("hero_join_annadanam")}
              </button>
            </div>
            <p className="mt-5 text-xs md:text-sm text-text-dark/65 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Every meal you support is a blessing shared with Veda pandits, poor Brahmin
              families, and pilgrims visiting Mallavaram.
            </p>
          </div>

          {/* Image in its own column — card frame, no overlay on text */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <figure className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(43,33,19,0.12)] ring-1 ring-maroon/10 bg-maroon/5">
              <Image
                src={withBasePath("/images/Satram-illuminated.jpeg")}
                alt="Mallavaram Brahmana Satram illuminated at night"
                fill
                className="object-cover object-center"
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 420px"
                unoptimized
              />
            </figure>
            <figcaption className="mt-2.5 text-center lg:text-right text-xs text-text-dark/55">
              Sri Mallavaram Brahmana Satram — evening darshan
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
}

