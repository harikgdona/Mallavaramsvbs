"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate, useConfig } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";

function AboutImageWithZoom({
  src,
  alt,
  unoptimized
}: {
  src: string;
  alt: string;
  unoptimized: boolean;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-maroon/15 shadow-sm bg-sandal/30 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsZoomed(true)}
      >
        {src.startsWith("data:") ? (
          <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-center" />
        ) : (
          <Image src={src} alt={alt} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 40vw" unoptimized={unoptimized} />
        )}
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

export function About() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { aboutImages } = useConfig();
  
  // Parse history from configurable text (pipe-separated paragraphs)
  const historyText = t("about_history");
  const history = historyText.split("|").map(p => p.trim());
  
  const ph = withBasePath("/images/placeholder.svg");
  const filledImages = (aboutImages || []).filter((s) => s.trim() !== "");
  const hasImages = filledImages.length > 0;

  return (
    <SectionContainer id="about">
      <h2 className="section-heading">{t("about_title")}</h2>

      {/* Elastic layout: 60/40 with images, 100% without */}
      <div className={`flex gap-6 mt-4 ${hasImages ? "flex-col md:flex-row" : ""}`}>

        {/* Images column — on mobile shows ABOVE text, on desktop shows on the RIGHT */}
        {hasImages ? (
          <div className="md:hidden space-y-3 mb-4">
            {filledImages.map((src, i) => {
              const img = resolveGalleryImageSrc(src, ph);
              return (
                <AboutImageWithZoom
                  key={i}
                  src={img.src}
                  alt={`About photo ${i + 1}`}
                  unoptimized={img.unoptimized}
                />
              );
            })}
          </div>
        ) : null}

        {/* Text column — 60% when images present, 100% otherwise */}
        <div className={hasImages ? "md:w-3/5" : "w-full"}>
          {/* About intro */}
          <p className="text-sm md:text-base text-text-dark/80 mb-4">
            {t("about_intro_1")}
          </p>
          <p className="text-sm md:text-base text-text-dark/80 mb-6">
            {t("about_intro_2")}
          </p>

          {/* History — in same container, flowing below intro */}
          <h3 className="font-heading text-base md:text-lg text-maroon mb-3">
            {t("about_history_heading")}
          </h3>
          <div className="space-y-3 text-sm md:text-base text-text-dark/85 leading-relaxed">
            {history.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Images column — desktop only (mobile version shown above) */}
        {hasImages ? (
          <div className="hidden md:block md:w-2/5 space-y-3">
            {filledImages.map((src, i) => {
              const img = resolveGalleryImageSrc(src, ph);
              return (
                <AboutImageWithZoom
                  key={i}
                  src={img.src}
                  alt={`About photo ${i + 1}`}
                  unoptimized={img.unoptimized}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
