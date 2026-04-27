"use client";

import { useState } from "react";
import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslate, useConfig } from "@/components/ConfigProvider";

export function Brahmostavam26Section() {
  const { language } = useLanguage();
  const t = useTranslate();
  const { brahmostavam26Photos } = useConfig();
  const [zoomedPhoto, setZoomedPhoto] = useState<{ src: string; alt: string } | null>(null);

  return (
    <SectionContainer id="brahmostavam-26">
      <h2 className="section-heading text-center">{t("brahmostavam26_title")}</h2>
      <p className="section-subtitle text-center max-w-2xl mx-auto mb-6">
        {t("brahmostavam26_subtitle")}
      </p>

      {brahmostavam26Photos && brahmostavam26Photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {brahmostavam26Photos.map((photo, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden border border-maroon/15 shadow-sm cursor-pointer group bg-gray-100"
                onClick={() => setZoomedPhoto({
                  src: photo.src,
                  alt: language === "te" ? photo.descriptionTe : photo.descriptionEn
                })}
              >
                <img
                  src={photo.src}
                  alt={language === "te" ? photo.descriptionTe : photo.descriptionEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              {(language === "te" ? photo.descriptionTe : photo.descriptionEn) ? (
                <p className="text-xs text-text-dark/70 text-center leading-snug line-clamp-2">
                  {language === "te" ? photo.descriptionTe : photo.descriptionEn}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-text-dark/60 text-sm py-12">
          {language === "te"
            ? "ఫోటోలు త్వరలో అందుబాటులో ఉంటాయి."
            : "Photos will be available soon."}
        </p>
      )}

      {/* Zoom Modal */}
      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomedPhoto(null)}
        >
          <button
            onClick={() => setZoomedPhoto(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close zoom"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedPhoto.src}
              alt={zoomedPhoto.alt}
              className="w-full h-full object-contain"
            />
            {zoomedPhoto.alt && (
              <p className="absolute bottom-0 left-0 right-0 text-center text-white text-sm bg-black/50 py-2 px-4">
                {zoomedPhoto.alt}
              </p>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  );
}
