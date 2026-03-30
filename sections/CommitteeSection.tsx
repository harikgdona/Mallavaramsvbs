"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";

function MemberImage({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  // next/image does not support base64 data URLs in static export — use plain img instead
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain object-center"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 90vw, 280px"
      className="object-contain object-center"
      unoptimized={unoptimized}
    />
  );
}

export function CommitteeSection() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { committeeMembers } = useConfig();
  const ph = withBasePath("/images/placeholder.svg");

  const visible = committeeMembers.filter(
    (m) =>
      m.src.trim() ||
      (language === "te" ? m.nameTe : m.nameEn).trim() ||
      (language === "te" ? m.designationTe : m.designationEn).trim()
  );

  return (
    <SectionContainer id="committee">
      <h2 className="section-heading">{t("committee_title")}</h2>
      <p className="section-subtitle mb-8">{t("committee_subtitle")}</p>

      {visible.length === 0 ? (
        <p className="text-sm text-text-dark/65 italic">
          Committee members can be added in the Configure section (admin).
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
          {visible.map((m, i) => {
            const name = (language === "te" ? m.nameTe : m.nameEn).trim() || "—";
            const designation = (language === "te" ? m.designationTe : m.designationEn).trim() || "";
            const img = resolveGalleryImageSrc(m.src.trim() || ph, ph);
            return (
              <li
                key={`committee-${i}`}
                className="rounded-2xl border border-maroon/15 bg-white/80 p-4 shadow-sm text-center"
              >
                <div className="relative mx-auto mb-4 w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-gold/50 bg-sandal/50 aspect-[5/4]">
                  <MemberImage src={img.src} alt={name} unoptimized={img.unoptimized} />
                </div>
                <p className="font-heading text-base font-bold text-maroon">{name}</p>
                {designation ? (
                  <p className="mt-1 text-sm text-text-dark/80">{designation}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </SectionContainer>
  );
}
