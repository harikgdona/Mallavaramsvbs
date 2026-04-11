"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/i18n/config";
import type { CommitteeMemberConfig } from "@/lib/committeeConfig";

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

export function CommitteeSection() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { committeeMembers } = useConfig();

  const visible = committeeMembers.filter((m) => rowVisible(m, language));
  const honorary = visible.filter((m) => (m.group ?? "working") === "honorary");
  const working = visible.filter((m) => (m.group ?? "working") === "working");

  const honoraryLine = honorary
    .map((m) => {
      const name = pickName(m, language);
      const designation = pickDesignation(m, language);
      return designation ? `${name} (${designation})` : name;
    })
    .join(" · ");

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
            <div className="rounded-2xl border border-maroon/15 bg-white/90 p-5 md:p-6 shadow-sm">
              <h3 className="font-heading text-lg md:text-xl text-maroon mb-3">
                {t("committee_honorary_heading")}
              </h3>
              <p className="text-sm md:text-base text-text-dark/85 leading-relaxed">{honoraryLine}</p>
            </div>
          ) : null}

          {working.length > 0 ? (
            <div className="rounded-2xl border border-maroon/15 bg-white/90 shadow-sm overflow-hidden">
              <h3 className="font-heading text-lg md:text-xl text-maroon px-5 pt-5 md:px-6 md:pt-6 pb-2">
                {t("committee_working_heading")}
              </h3>
              <div className="overflow-x-auto px-2 pb-5 md:px-4 md:pb-6">
                <table className="w-full min-w-[280px] text-sm md:text-base text-left border-collapse">
                  <thead>
                    <tr className="bg-sky-100 text-text-dark">
                      <th
                        scope="col"
                        className="font-heading font-semibold text-maroon px-3 py-3 border-b border-maroon/15"
                      >
                        {t("committee_table_designation")}
                      </th>
                      <th
                        scope="col"
                        className="font-heading font-semibold text-maroon px-3 py-3 border-b border-maroon/15"
                      >
                        {t("committee_table_name")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {working.map((m, i) => {
                      const name = pickName(m, language);
                      const designation = pickDesignation(m, language) || "—";
                      return (
                        <tr
                          key={`working-${i}-${name}`}
                          className="border-b border-maroon/10 last:border-b-0 odd:bg-sandal/20"
                        >
                          <td className="px-3 py-2.5 text-text-dark/90 align-top whitespace-nowrap">
                            {designation}
                          </td>
                          <td className="px-3 py-2.5 text-text-dark font-medium align-top">{name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </SectionContainer>
  );
}
