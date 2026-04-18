"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig, useTranslate } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { withBasePath } from "@/lib/basePath";

function MemberImage({ src, alt, unoptimized }: { src: string; alt: string; unoptimized: boolean }) {
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain object-center" />;
  }
  return (
    <Image src={src} alt={alt} fill sizes="(max-width: 640px) 90vw, 280px" className="object-contain object-center" unoptimized={unoptimized} />
  );
}

// Honorary members (first 4)
const honorary = [
  { src: "", nameEn: "Sri Gali Narasimha Murthy", nameTe: "శ్రీ గాలి నరసింహ మూర్తి", designationEn: "Honorary President", designationTe: "గౌరవ అధ్యక్షుడు" },
  { src: "", nameEn: "Sri Doddavarapu Srinivas Siva Rama Krishna", nameTe: "శ్రీ దొడ్డవరపు శ్రీనివాస శివరామకృష్ణ", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు" },
  { src: "", nameEn: "Sri Neelamraju Venkata Subba Rao", nameTe: "శ్రీ నీలంరాజు వెంకట సుబ్బా రావు", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు" },
  { src: "", nameEn: "Sri Neelamraju Pavan Kumar", nameTe: "శ్రీ నీలంరాజు పవన్ కుమార్", designationEn: "Honorary Vice President", designationTe: "గౌరవ ఉపాధ్యక్షుడు" },
];

// Working committee (remaining 15)
const working = [
  { src: "", nameEn: "Sri Neelamraju Subba Santha Rao", nameTe: "శ్రీ నీలంరాజు సుబ్బ శాంతారావు", designationEn: "President", designationTe: "అధ్యక్షుడు" },
  { src: "", nameEn: "Sri Gali Venkata Rambabu", nameTe: "శ్రీ గాలి వెంకట రాంబాబు", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు" },
  { src: "", nameEn: "Sri Damaraju Venkata Laxmi Raghava Rao", nameTe: "శ్రీ దామరాజు వెంకట లక్ష్మి రాఘవ రావు", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు" },
  { src: "", nameEn: "Sri Gali Suneel", nameTe: "శ్రీ గాలి సునీల్", designationEn: "Vice President", designationTe: "ఉపాధ్యక్షుడు" },
  { src: "", nameEn: "Sri Rachapudi Sri Krishna", nameTe: "శ్రీ రాచపూడి శ్రీ కృష్ణ", designationEn: "Secretary", designationTe: "కార్యదర్శి" },
  { src: "", nameEn: "Sri Gali Satya Rama Koteswara Rao", nameTe: "శ్రీ గాలి సత్యరామ కోటేశ్వర రావు", designationEn: "Treasurer", designationTe: "కోశాధికారి" },
  { src: "", nameEn: "Sri Dhenuvakonda Seshagiri Rao", nameTe: "శ్రీ దేనువకొండ శేషగిరి రావు", designationEn: "Joint Secretary", designationTe: "సహ కార్యదర్శి" },
  { src: "", nameEn: "Sri Neelamraju Rama Krishna", nameTe: "శ్రీ నీలంరాజు రామ కృష్ణ", designationEn: "Joint Secretary", designationTe: "సహ కార్యదర్శి" },
  { src: "", nameEn: "Sri Vavilala Gurucharan Das", nameTe: "శ్రీ వావిలాల గురుచరణ దాస్", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri Pamidighantam Ranga Rao", nameTe: "శ్రీ పమిడిఘంటం రంగారావు", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri Mallavarapu Balakrishna", nameTe: "శ్రీ మల్లవరపు బాలకృష్ణ", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri Sakshi Satya Narayana", nameTe: "శ్రీ సాక్షి సత్య నారాయణ", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri Guda Chidambara Sastry", nameTe: "శ్రీ గూడ చిదంబర శాస్త్రి", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri G.V.S. Chalapathi", nameTe: "శ్రీ జి.వి.ఎస్. చలపతి", designationEn: "Member", designationTe: "సభ్యుడు" },
  { src: "", nameEn: "Sri Addanki Venkata Ramana Kiran", nameTe: "శ్రీ అద్దంకి వెంకట రమణ కిరణ్", designationEn: "Member", designationTe: "సభ్యుడు" },
];

function MemberCard({ nameEn, nameTe, designationEn, designationTe, src, language }: {
  nameEn: string; nameTe: string; designationEn: string; designationTe: string; src?: string; language: string;
}) {
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

  return (
    <SectionContainer id="committee">
      <h2 className="section-heading">{t("committee_title")}</h2>
      <p className="section-subtitle mb-6">{t("committee_subtitle")}</p>

      <h3 className="font-heading text-lg text-maroon mb-4">
        {language === "te" ? "గౌరవ సభ్యులు" : "Honorary Members"}
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0 mb-8">
        {honorary.map((m, i) => (
          <MemberCard key={`h-${i}`} {...m} language={language} />
        ))}
      </ul>

      <h3 className="font-heading text-lg text-maroon mb-4">
        {language === "te" ? "కార్యనిర్వాహక కమిటీ" : "Working Committee"}
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        {working.map((m, i) => (
          <MemberCard key={`w-${i}`} {...m} language={language} />
        ))}
      </ul>
    </SectionContainer>
  );
}
