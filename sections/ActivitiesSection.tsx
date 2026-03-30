"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslate } from "@/components/ConfigProvider";

const activities = [
  {
    key: "Annadanam",
    keyTe: "అన్నదానం",
    description:
      "Daily and special occasions Annadanam for poor Brahmin families, Veda pandits and pilgrims.",
    descriptionTe:
      "పేద బ్రాహ్మణ కుటుంబాలు, వేద పండితులు మరియు యాత్రికుల కోసం రోజువారీ మరియు ప్రత్యేక అన్నదానం."
  },
  {
    key: "Satram Services",
    keyTe: "సత్రం సేవలు",
    description:
      "Simple accommodation and prasadam for visiting families and devotees, subject to availability.",
    descriptionTe:
      "వచ్చే కుటుంబాలు మరియు భక్తులకు సాధారణ వసతి, ప్రసాదం (లభ్యతకు లోబడి)."
  },
  {
    key: "Spiritual Activities",
    keyTe: "ఆధ్యాత్మిక కార్యక్రమాలు",
    description:
      "Support for Veda parayanam, homams and traditional temple-related dharmic activities.",
    descriptionTe:
      "వేదపారాయణం, హోమాలు మరియు ఆలయ సంబంధిత సంప్రదాయ ధార్మిక కార్యక్రమాలకు సహాయం."
  }
];

export function ActivitiesSection() {
  const { language } = useLanguage();
  const t = useTranslate();

  return (
    <SectionContainer id="activities">
      <h2 className="section-heading text-center">
        {t("activities_title")}
      </h2>
      <p className="section-subtitle text-center max-w-2xl mx-auto mb-8">
        A modular seva structure that can grow with future projects and services
        at Mallavaram village.
      </p>

      <div className="grid md:grid-cols-3 gap-5">
        {activities.map((activity) => (
          <div
            key={activity.key}
            className="bg-white rounded-3xl border border-maroon/10 shadow-sm px-5 py-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-heading text-lg md:text-xl text-maroon mb-2">
                {language === "te" ? activity.keyTe : activity.key}
              </h3>
              <p className="text-sm md:text-base text-text-dark/80">
                {language === "te" ? activity.descriptionTe : activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

