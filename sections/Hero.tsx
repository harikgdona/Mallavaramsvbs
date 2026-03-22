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
      className="relative overflow-hidden bg-transparent"
      aria-label="Hero section"
    >
      {/* Center image only on home page, behind content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <div className="w-full max-w-4xl h-[60vh] relative">
          <Image
            src={withBasePath("/images/Satram-illuminated.jpeg")}
            alt="Mallavaram Brahmana Satram"
            fill
            className="object-contain object-center"
            priority
            quality={95}
            unoptimized
          />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 flex flex-col items-center gap-10 md:gap-12">
        <div className="w-full md:w-4/5 text-text-dark text-center md:text-left">
          <p className="inline-block rounded-full border border-gold/70 bg-gold/10 px-4 py-1 text-xs md:text-sm tracking-wide mb-4">
            Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu
          </p>
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl leading-snug mb-4">
            <span className="block">Serving Dharma.</span>
            <span className="block text-[0.75em]">Supporting Brahmin Families.</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-text-dark/80 max-w-xl mb-6 md:mb-8">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
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
          <p className="mt-4 text-xs md:text-sm text-text-dark/75 max-w-md">
            Every meal you support is a blessing shared with Veda pandits, poor Brahmin
            families, and pilgrims visiting Mallavaram.
          </p>
        </div>
      </div>
    </section>
  );
}

