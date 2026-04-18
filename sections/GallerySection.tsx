"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";
import { ImageZoom } from "@/components/ImageZoom";

function GalleryImage({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  // next/image does not support base64 data URLs in static export — use plain img instead
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      unoptimized={unoptimized}
    />
  );
}

function GalleryImageWithZoom({
  src,
  alt,
  unoptimized,
  caption
}: {
  src: string;
  alt: string;
  unoptimized: boolean;
  caption: string;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div
        key={`${src}`}
        className="group relative aspect-square sm:aspect-[5/4] md:aspect-square max-h-52 sm:max-h-none rounded-2xl overflow-hidden border border-maroon/15 shadow-sm cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        <GalleryImage src={src} alt={alt} unoptimized={unoptimized} />
        {caption ? (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 bg-maroon/80 px-2 py-1.5 z-10">
            <p className="text-white text-[0.65rem] leading-snug text-center line-clamp-3">{caption}</p>
          </div>
        ) : null}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close zoom"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {src.startsWith("data:") ? (
              <img src={src} alt={alt} className="w-full h-full object-contain" />
            ) : (
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                unoptimized={unoptimized}
                sizes="90vw"
              />
            )}
          </div>
        </div>
      )}
    </>
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
        {language === "te"
          ? "మల్లవరంలో అన్నదానం, సత్రం వాతావరణం మరియు ధార్మిక కార్యకలాపాల చిత్రాలు."
          : "Glimpses of Annadanam, satram ambience and dharmic activities at Mallavaram."}
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
            const caption =
              language === "te" && slot.descriptionTe?.trim()
                ? slot.descriptionTe.trim()
                : slot.descriptionEn?.trim() || "";
            return (
              <GalleryImageWithZoom
                key={`${slot.src}-${i}`}
                src={src}
                alt={alt}
                unoptimized={unoptimized}
                caption={caption}
              />
            );
          })}
        </div>
      )}
    </SectionContainer>
  );
}
