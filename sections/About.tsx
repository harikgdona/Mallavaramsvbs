"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate, useConfig } from "@/components/ConfigProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";

const historyEn = [
  `The Concept and the need of "Brahmana Satram" at Mallavaram came during pre-independence days where Brahmins used to visit Mallavaram for Sri Venkateswara Swamy Brahmostavams and there was no place for them to cook and stay.`,
  `In 1950's, Sri Late Gullapalli Gopaiah constructed a permanent Brahmin Satram Facility at the footsteps of Mallavaram hill. From that time, the "Old Brahmin Satram" accommodated several Brahmin Families during Brahmostavam days.`,
  `Sri Late Gali Venkata Subba Rao ("Perumallu") popularised Mallavaram temple and Satram, bringing Varshika Daatalu and itemized funding. He built a strong team of relatives and nurtured young talent.`,
  `During 2007, due to the Mallavaram Reservoir project, the old satram was taken by Govt. A new satram was built with 2 rooms, 4 bathrooms and an open hall.`,
  `After Covid, a new committee was formed under Sri Gali Narasimha Murthy and Sri Neelamraju Santhiah. They modernized the building, added borewell, toilets, stage, and washing basins.`,
  `From 2021 onwards, Karthika Samaradhana with Rudrabhishekam was started. In 2024, monthly "Annadaana Padhakam" was initiated.`,
  `**** Namo Venkatesaya ****`,
];

const historyTe = [
  `మల్లవరం గ్రామంలో "బ్రాహ్మణ సత్రం" అనే ఆలోచన స్వాతంత్ర్యానికి ముందు కాలంలో వచ్చింది. బ్రాహ్మణ కుటుంబాలు బ్రహ్మోత్సవాలకు వచ్చేవారు కానీ వండుకునేందుకు, ఉండేందుకు స్థలం ఉండేది కాదు.`,
  `1950 లలో శ్రీ గుళ్ళపల్లి గోపయ్య గారు మల్లవరం కొండ క్రిందన శాశ్వత బ్రాహ్మణ సత్రాన్ని నిర్మించారు. ఆ తరువాత నుండి బ్రహ్మోత్సవాల సమయంలో అనేక కుటుంబాలకు ఆశ్రయం కల్పించింది.`,
  `శ్రీ గాలి వెంకట సుబ్బారావు గారు (పెరుమాళ్) మల్లవరం ఆలయం మరియు సత్రాన్ని ప్రజాదరణ పొందేలా చేశారు. వార్షిక దాతలను ఏర్పరచి అన్నదానం కార్యక్రమాన్ని విస్తరించారు.`,
  `2007లో రిజర్వాయర్ ప్రాజెక్ట్ కారణంగా పాత సత్రం స్థలం ప్రభుత్వానికి వెళ్లింది. కొత్త సత్రం 2 గదులు, 4 బాత్రూములు మరియు ఓపెన్ హాల్‌తో నిర్మించారు.`,
  `కోవిడ్ తరువాత శ్రీ గాలి నరసింహమూర్తి మరియు శ్రీ నీలంరాజు శాంతయ్య గారి మార్గదర్శకత్వంలో కొత్త కమిటీ ఏర్పడింది. సత్రం భవనం ఆధునీకరణ, బోర్‌వెల్, టాయిలెట్లు, స్టేజ్ నిర్మాణం చేశారు.`,
  `2021 నుండి కార్తీక సమారాధన రుద్రాభిషేకంతో ప్రారంభించారు. 2024లో నెలవారీ "అన్నదాన పథకం" ప్రారంభించారు.`,
  `*** నమో వెంకటేశాయ ***`,
];

export function About() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { aboutImages } = useConfig();
  const history = language === "te" ? historyTe : historyEn;
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
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-maroon/15 shadow-sm bg-sandal/30">
                  {img.src.startsWith("data:") ? (
                    <img src={img.src} alt={`About photo ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Image src={img.src} alt={`About photo ${i + 1}`} fill className="object-cover" sizes="100vw" unoptimized={img.unoptimized} />
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Text column — 60% when images present, 100% otherwise */}
        <div className={hasImages ? "md:w-3/5" : "w-full"}>
          {/* About intro */}
          <p className="text-sm md:text-base text-text-dark/80 mb-4">
            {language === "te"
              ? "ఆంధ్రప్రదేశ్, ప్రకాశం జిల్లా, మల్లవరం గ్రామంలో ఉన్న శ్రీ మల్లవరం వెంకటేశ్వర అన్నదాన సమాజం మరియు బ్రాహ్మణ సత్రం అనేది పేద బ్రాహ్మణ కుటుంబాలను అన్నదానం, ఆధ్యాత్మిక సేవలు మరియు సమాజ సహాయం ద్వారా మద్దతు ఇవ్వడానికి అంకితమైన చారిటబుల్ ట్రస్ట్."
              : "Located in Mallavaram village, Prakasam district, Andhra Pradesh, Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana Satramu is a charitable trust dedicated to supporting poor Brahmin families through daily Annadanam, spiritual services, and community support."}
          </p>
          <p className="text-sm md:text-base text-text-dark/80 mb-6">
            {language === "te"
              ? "బ్రాహ్మణ సత్రం ఒక మంచి సాంక్షిప్తమైన మరియు భక్తిపూర్ణమైన స్థలాన్ని అందిస్తుంది, ఇక్కడ యాత్రికులు, వేద పండితులు మరియు స్థానిక కుటుంబాలు విశ్రాంతి పొందవచ్చు, ప్రసాదం పొందవచ్చు మరియు సంప్రదాయ ధార్మిక కార్యకలాపాలలో గౌరవం మరియు మర్యాదతో పాల్గొనవచ్చు."
              : "The satram offers a simple, clean and devotional space where pilgrims, Veda pandits and local families can rest, receive prasadam and participate in traditional dharmic activities with dignity and respect."}
          </p>

          {/* YouTube link box */}
          <div className="mb-4 rounded-xl border border-maroon/25 bg-sandal/40 px-4 py-3 shadow-sm">
            <p className="text-sm md:text-base font-bold italic text-maroon/90">
              {language === "te"
                ? "ఆలయ వీక్షణ మరియు కార్యక్రమాల వివరాల కోసం, దయచేసి క్రింది లింక్‌లోని వీడియోను చూడండి:"
                : "For Temple view and programmes in detail, please watch the video in the following link:"}
            </p>
            <a
              href="https://youtu.be/OalXu5h44a8?si=PSvPRTCC5yJc8NOD"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm md:text-base font-bold italic text-maroon underline underline-offset-2 hover:text-maroon/70 break-all"
            >
              https://youtu.be/OalXu5h44a8?si=PSvPRTCC5yJc8NOD
            </a>
          </div>

          {/* History — in same container, flowing below intro */}
          <h3 className="font-heading text-base md:text-lg text-maroon mb-3">
            {language === "te"
              ? "శ్రీ మల్లవరం బ్రాహ్మణ సత్రం చరిత్ర"
              : "History of Sri Mallavaram Brahmana Satram"}
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
                <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-maroon/15 shadow-sm bg-sandal/30">
                  {img.src.startsWith("data:") ? (
                    <img src={img.src} alt={`About photo ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Image src={img.src} alt={`About photo ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" unoptimized={img.unoptimized} />
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
