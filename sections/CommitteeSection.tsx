"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/i18n/config";
import type { CommitteeMemberConfig } from "@/lib/committeeConfig";
import { getCommitteeMemberPhotoStem } from "@/lib/committeeMemberPhotoStem";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";
import { CommitteeFolderImage } from "@/components/CommitteeFolderImage";

function rowVisible(m: CommitteeMemberConfig, language: Language) {
  const name =
    language === "te"
      ? (m.nameTe.trim() || m.nameEn).trim()
      : (m.nameEn.trim() || m.nameTe).trim();
  const desig =
    language === "te"
      ? (m.designationTe.trim() || m.designationEn).trim()
      : (m.designationEn.trim() || m.designationTe).trim();
  return Boolean(m.src.trim() || name || desig);
}

function pickName(m: CommitteeMemberConfig, language: Language) {
  if (language === "te") {
    return m.nameTe.trim() || m.nameEn.trim() || "—";
  }
  return m.nameEn.trim() || m.nameTe.trim() || "—";
}

function pickDesignation(m: CommitteeMemberConfig, language: Language) {
  if (language === "te") {
    return m.designationTe.trim() || m.designationEn.trim();
  }
  return m.designationEn.trim() || m.designationTe.trim();
}

function CommitteeMemberPhoto({
  src,
  alt,
  unoptimized
}: {
  src: string;
  alt: string;
  unoptimized: boolean;
}) {
  if (src.startsWith("data:")) {
    return (
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-top" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="(max-width: 640px) 22vw, (max-width: 1024px) 12vw, 9vw"
      unoptimized={unoptimized}
    />
  );
}

/** ~50% smaller than previous full-column cards: narrow frame, tighter type */
function CommitteeMemberCard({
  m,
  peers,
  language,
  placeholder
}: {
  m: CommitteeMemberConfig;
  peers: CommitteeMemberConfig[];
  language: Language;
  placeholder: string;
}) {
  const name = pickName(m, language);
  const designation = pickDesignation(m, language) || "—";
  const rawSrc = m.src.trim();
  const { src, unoptimized } = resolveGalleryImageSrc(rawSrc, placeholder);
  const useOverride = rawSrc !== "" && src !== placeholder;
  const stem = getCommitteeMemberPhotoStem(m, peers);
  const alt = `${designation} — ${name}`;

  return (
    <li className="flex justify-center">
      <div className="flex w-full max-w-[9rem] sm:max-w-[10rem] flex-col overflow-hidden rounded-lg border-2 border-maroon/25 bg-white shadow-sm">
        <div className="relative aspect-[4/5] w-full bg-sky-100/90 border-b-2 border-maroon/20">
          {useOverride ? (
            <CommitteeMemberPhoto src={src} alt={alt} unoptimized={unoptimized} />
          ) : (
            <CommitteeFolderImage stem={stem} alt={alt} />
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-2 py-2 text-center">
          <p className="text-[0.6rem] sm:text-[0.65rem] font-heading font-semibold uppercase tracking-wide text-maroon leading-tight">
            {designation}
          </p>
          <p className="text-[0.65rem] sm:text-xs font-medium text-text-dark leading-snug">{name}</p>
        </div>
      </div>
    </li>
  );
}

export function CommitteeSection() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { committeeMembers } = useConfig();
  const placeholder = withBasePath("/images/placeholder.svg");

  const visible = committeeMembers.filter((m) => rowVisible(m, language));
  const honorary = visible.filter((m) => (m.group ?? "working") === "honorary");
  const working = visible.filter((m) => (m.group ?? "working") === "working");

  return (
    <SectionContainer id="committee">
      <h2 className="section-heading">{t("committee_title")}</h2>
      <p className="section-subtitle mb-8">{t("committee_subtitle")}</p>

      {visible.length === 0 ? (
        <p className="text-sm text-text-dark/65 italic">
          Committee members can be added in the Configure section (admin).
        </p>
      ) : (
        <div className="space-y-10">
          {honorary.length > 0 ? (
            <div className="border-b border-maroon/25 pb-8">
              <h3 className="font-heading text-lg md:text-xl text-maroon mb-4 md:mb-5">
                {t("committee_honorary_heading")}
              </h3>
              <ul
                className={[
                  "grid list-none gap-3 p-0 m-0 justify-items-center",
                  honorary.length === 1 && "grid-cols-1",
                  honorary.length === 2 && "grid-cols-2",
                  honorary.length === 3 && "grid-cols-3",
                  honorary.length > 3 && "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {honorary.map((m, i) => (
                  <CommitteeMemberCard
                    key={`honorary-${i}-${pickName(m, language)}`}
                    m={m}
                    peers={honorary}
                    language={language}
                    placeholder={placeholder}
                  />
                ))}
              </ul>
            </div>
          ) : null}

          {working.length > 0 ? (
            <div>
              <h3 className="font-heading text-lg md:text-xl text-maroon mb-4 md:mb-5">
                {t("committee_working_heading")}
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 list-none p-0 m-0 justify-items-center">
                {working.map((m, i) => (
                  <CommitteeMemberCard
                    key={`working-${i}-${pickName(m, language)}`}
                    m={m}
                    peers={working}
                    language={language}
                    placeholder={placeholder}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </SectionContainer>
  );
}
