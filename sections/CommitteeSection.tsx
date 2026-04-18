"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";
import type { CommitteeMemberConfig } from "@/lib/committeeConfig";

function MemberImage({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain object-center" />;
  }
  return (
    <Image src={src} alt={alt} fill sizes="(max-width: 640px) 90vw, 280px" className="object-contain object-center" unoptimized={unoptimized} />
  );
}

function MemberCard({ nameEn, nameTe, designationEn, designationTe, src, language }: CommitteeMemberConfig & { language: string }) {
  const name = language === "te" ? nameTe : nameEn;
  const designation = language === "te" ? designationTe : designationEn;
  const ph = withBasePath("/images/placeholder.svg");
  const hasSrc = src && src.trim();
  const img = hasSrc ? resolveGalleryImageSrc(src, ph) : { src: ph, unoptimized: false };

  return (
    <li className="rounded-2xl border border-maroon/15 bg-white/80 p-4 shadow-sm text-center">
      <div className="relative mx-auto mb-3 w-20 h-20 overflow-hidden rounded-full border-2 border-gold/50 bg-sandal/50">
        <MemberImage src={img.src} alt={name} unoptimized={img.unoptimized} />
      </div>
      <p className="font-heading text-base font-bold text-maroon">{name}</p>
      <p className="mt-1 text-sm text-text-dark/80">{designation}</p>
    </li>
  );
}

export function CommitteeSection() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { committeeMembers } = useConfig();

  const honorary = committeeMembers.filter((m) => m.group === "honorary");
  const working = committeeMembers.filter((m) => m.group !== "honorary");

  return (
    <SectionContainer id="committee">
      <h2 className="section-heading">{t("committee_title")}</h2>
      <p className="section-subtitle mb-6">{t("committee_subtitle")}</p>

      {honorary.length > 0 && (
        <>
          <h3 className="font-heading text-lg text-maroon mb-4">
            {language === "te" ? "గౌరవ సభ్యులు" : "Honorary Members"}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0 mb-8">
            {honorary.map((m, i) => (
              <MemberCard key={`h-${i}`} {...m} language={language} />
            ))}
          </ul>
        </>
      )}

      {working.length > 0 && (
        <>
          <h3 className="font-heading text-lg text-maroon mb-4">
            {language === "te" ? "కార్యనిర్వాహక కమిటీ" : "Working Committee"}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
            {working.map((m, i) => (
              <MemberCard key={`w-${i}`} {...m} language={language} />
            ))}
          </ul>
        </>
      )}

      {committeeMembers.length === 0 && (
        <p className="text-sm text-text-dark/60 text-center py-8">No committee members configured yet.</p>
      )}
    </SectionContainer>
  );
}
