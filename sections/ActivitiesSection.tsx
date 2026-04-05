"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";
import { useTranslate } from "@/components/ConfigProvider";

export function ActivitiesSection() {
  const { language } = useLanguage();
  const t = useTranslate();

  return (
    <SectionContainer id="activities">
      <h2 className="section-heading text-center">
        {t("activities_title")}
      </h2>

      <div className="mt-6 space-y-5 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-5">
          <h3 className="font-heading text-maroon text-base mb-2">
            {language === "te"
              ? "మన సత్రంలో సాంస్కృతిక & ధార్మిక కార్యక్రమాలు"
              : "Cultural & Dharmic Activities at Our Satram"}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-text-dark/80">
            <li>
              {language === "te"
                ? `బ్రహ్మోత్సవం రోజుల్లో మన సత్రంలో సంప్రదాయ "తరంగాలు" గానం.`
                : `Traditional "Tarangalu" Singing at our Satram during Brahmostavam days.`}
            </li>
            <li>
              {language === "te"
                ? `కార్తిక సమారాధన సందర్భంగా మన సత్రంలో "సామూహిక రుద్రాభిషేకం" నిర్వహించబడుతుంది.`
                : `"Saamuhikha Rudrabhishekham" performed at our Satram on the occasion of Karthika Samaradhana.`}
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-5">
          <h3 className="font-heading text-maroon text-base mb-2">
            {language === "te"
              ? "ఇతర కార్యక్రమాలు మన సత్రంలో"
              : "Other Programs at Our Satram"}
          </h3>
          <p className="text-sm md:text-base text-text-dark/80">
            {language === "te"
              ? "మన సత్రంలో వివాహాలు, ఉపనయనము మొదలైన కొన్ని వ్యక్తిగత మరియు ధార్మిక కార్యక్రమాలు చెయ్యడానికి బహిర్గత వ్యక్తులకు అద్దెకు ఇవ్వవచ్చు, పేద బ్రాహ్మణులకు తక్షణ తగ్గింపుతో."
              : "Our Satram can be rented for outside people for performing religious and personal functions like Marriages, Upanayanams etc., at discounted rates for poor Brahmins."}
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
