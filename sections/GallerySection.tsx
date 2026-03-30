"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";

function GalleryImage({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  // next/image does not support base64 data URLs in static export — use plain img instead
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      unoptimized={unoptimized}
    />
  );
}

export function GallerySection() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { gallerySlots } = useConfig();
  const placeholder = withBasePath("/images/placeholder.svg");
  const filled = gallerySlots
    .filter((s) => s.src.trim() !== "")
    .sort((a, b) => {
      const numA = parseInt(a.src.match(/(\d+)/)?.[1] ?? "0");
      const numB = parseInt(b.src.match(/(\d+)/)?.[1] ?? "0");
      return numA - numB;
    });

  return (
    <SectionContainer id="gallery">
      <h2 className="section-heading text-center">
        {t("gallery_title")}
      </h2>
      <p className="section-subtitle text-center max-w-2xl mx-auto mb-8">
        Glimpses of Annadanam, satram ambience and dharmic activities
        at Mallavaram.
      </p>

      {filled.length === 0 ? (
        <p className="text-center text-text-dark/70 text-sm max-w-xl mx-auto">
          Photos will appear here once they are added in Configure (admin).
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {filled.map((slot, i) => {
            const { src, unoptimized } = resolveGalleryImageSrc(slot.src, placeholder);
            const alt =
              language === "te" && slot.altTe.trim()
                ? slot.altTe.trim()
                : slot.altEn.trim() || `Gallery photo ${i + 1}`;
            return (
              <div
                key={`${slot.src}-${i}`}
                className="relative aspect-square sm:aspect-[5/4] md:aspect-square max-h-52 sm:max-h-none rounded-2xl overflow-hidden border border-maroon/15 shadow-sm"
              >
                <GalleryImage src={src} alt={alt} unoptimized={unoptimized} />
              </div>
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
