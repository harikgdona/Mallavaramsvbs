"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";
import { useConfig } from "@/components/ConfigProvider";
import { ImageZoom } from "@/components/ImageZoom";
import { withBasePath } from "@/lib/basePath";

export function AnnadanamSection() {
  const { language } = useLanguage();
  const { annadanamPhotos } = useConfig();

  return (
    <SectionContainer id="annadanam" className="bg-sandal/60">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="section-heading">
            {language === "te" ? "అన్నదానం – భక్తితో భోజనం" : "Annadanam – Feeding with Devotion"}
          </h2>
          <p className="section-subtitle mb-4">
            {language === "te"
              ? "అన్నదానం మా ప్రధాన సేవ. మీ సహకారంతో అర్హులైన బ్రాహ్మణ కుటుంబాలకు, యాత్రికులకు మరియు వేద పండితులకు సంవత్సరమంతా సాత్వికాహార భోజనాన్ని అందిస్తున్నాం."
              : "Annadanam is our primary seva. With your support, we provide simple, sattvic meals to deserving Brahmin families, visiting pilgrims, and Veda pandits throughout the year."}
          </p>
          <p className="text-sm md:text-base text-text-dark/85 font-semibold mb-3">
            {language === "te"
              ? `ప్రస్తుతం మన సత్రంలో "అన్నదానం" బ్రాహ్మణ కుటుంబాల కోసం క్రింది సందర్భాల్లో నిర్వహించబడుతుంది:`
              : "Currently at Our Satram, Annadanam is performed on the following occasions for Brahmin Families:"}
          </p>

          <div className="space-y-4 text-sm md:text-base text-text-dark/80">
            <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
              <p className="font-heading text-maroon mb-1">
                {language === "te" ? `1. అన్న ప్రసాదం "బ్రహ్మోత్సవం రోజుల్లో"` : "1. Annaprasadam @ Brahmostavam Days"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{language === "te" ? "గజోత్సవం రాత్రి భోజనం" : "Dinner for Gajostsavam Night"}</li>
                <li>{language === "te" ? `"స్వామి వారి కల్యాణం" రోజున అల్పాహారం` : "Breakfast on Swami Vaari Kalyanam Day"}</li>
                <li>{language === "te" ? `"స్వామి వారి కల్యాణం" రోజున మధ్యాహ్న భోజనం` : "Lunch on Swami Vaari Kalyanam Day"}</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
              <p className="font-heading text-maroon mb-1">
                {language === "te" ? "2. అన్నదానం @కార్తిక సమారాధన" : "2. Annadaanam @ Karthika Samaradhana"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{language === "te" ? "ఉదయ ఉపాహారం" : "Breakfast"}</li>
                <li>{language === "te" ? "మధ్యాహ్న భోజనం" : "Lunch"}</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
              <p className="font-heading text-maroon mb-1">
                {language === "te" ? "3. అన్నదానం ప్రతీ నెల" : "3. Annadaanam Every Month"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{language === "te" ? "2వ శనివారం మధ్యాహ్న భోజనం" : "Lunch on 2nd Saturday"}</li>
                <li>{language === "te" ? "2వ ఆదివారం మధ్యాహ్న భోజనం" : "Lunch on 2nd Sunday"}</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
              <p className="font-heading text-maroon mb-1">
                {language === "te" ? "4. వైకుంఠ సమారాధన సందర్భంగా అన్నదానం" : "4. Annadaanam on Vaikunta Samaradhana"}
              </p>
              <p className="text-xs text-maroon/70 italic mb-1">
                {language === "te" ? "ప్రతిపాదిత, 2026 నుండి ప్రారంభం" : "Proposed, starting from 2026"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{language === "te" ? "ఉదయ ఉపాహారం" : "Breakfast"}</li>
                <li>{language === "te" ? "మధ్యాహ్న భోజనం" : "Lunch"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          {/* Annadanam Photos Section */}
          {annadanamPhotos && annadanamPhotos.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {annadanamPhotos.map((photo, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="relative h-36 md:h-44 lg:h-52 rounded-3xl overflow-hidden shadow-md border border-maroon/15">
                      <ImageZoom
                        src={photo.src}
                        alt={language === "te" ? photo.descriptionTe : photo.descriptionEn}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs md:text-sm text-text-dark/75 leading-relaxed">
                      {language === "te" ? photo.descriptionTe : photo.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="relative h-36 md:h-44 lg:h-52 rounded-3xl overflow-hidden shadow-md border border-maroon/15">
                <Image
                  src={withBasePath("/images/uploads/svbs_image47.jpeg")}
                  alt="Annadanam serving"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="relative h-36 md:h-44 lg:h-52 rounded-3xl overflow-hidden shadow-md border border-maroon/15">
                <Image
                  src={withBasePath("/images/uploads/svbs_image48.jpeg")}
                  alt="Prasadam distribution"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
