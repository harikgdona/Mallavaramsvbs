"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useLanguage } from "@/components/LanguageProvider";

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.0!2d79.6833!3d15.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb4e8f0a0a0a0a1%3A0x1!2sSri+Venkateswara+Swamy+Temple+Mallavaram!5e0!3m2!1sen!2sin!4v1711800000000";

const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/pzzSemARxTMfoyWg6";

const SATRAM_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500!2d79.9825893!3d15.6595017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1711800000001";

const SATRAM_MAPS_LINK = "https://www.google.com/maps?q=15.6595017,79.9825893&z=17&hl=en";

export function DirectionsSection() {
  const { language } = useLanguage();

  return (
    <SectionContainer id="directions">
      <h2 className="section-heading">
        {language === "te" ? "దిశలు / మార్గం" : "Directions"}
      </h2>
      <p className="section-subtitle mb-6">
        {language === "te"
          ? "శ్రీ వెంకటేశ్వర స్వామి ఆలయం, మల్లవరం, ప్రకాశం జిల్లా"
          : "Sri Venkateswara Swami Temple, Mallavaram, Prakasam District"}
      </p>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="w-full rounded-3xl overflow-hidden border border-maroon/15 shadow-md" style={{ height: "280px" }}>
          <iframe
            src={GOOGLE_MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            aria-label="Map showing Sri Venkateswara Swami Temple, Mallavaram"
            allowFullScreen
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
            <h3 className="font-heading text-maroon text-base mb-2">
              {language === "te" ? "చిరునామా" : "Address"}
            </h3>
            <p className="text-sm text-text-dark/80 leading-relaxed">
              Sri Venkateswara Swami Temple,<br />
              Mallavaram Village,<br />
              Maddipadu Mandal,<br />
              Prakasam District,<br />
              Andhra Pradesh - 523263
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-maroon/10 shadow-sm p-4">
            <h3 className="font-heading text-maroon text-base mb-2">
              {language === "te" ? "ఎలా చేరుకోవాలి" : "How to Reach"}
            </h3>
            <p className="text-sm text-text-dark/80 leading-relaxed">
              {language === "te"
                ? "ఒంగోలు పట్టణం నుండి 20 కి.మీ. రోడ్డు మార్గంలో సులభంగా చేరుకోవచ్చు."
                : "20 km from Ongole town, easily accessible by road."}
            </p>
          </div>

          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block text-center"
          >
            {language === "te" ? "Google Maps లో తెరవండి" : "Open Temple in Google Maps"}
          </a>
        </div>
      </div>

      {/* Directions to Satram */}
      <h3 className="font-heading text-lg text-maroon mt-8 mb-4">
        {language === "te" ? "సత్రం దిశలు" : "Directions to Satram"}
      </h3>
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="w-full rounded-3xl overflow-hidden border border-maroon/15 shadow-md" style={{ height: "280px" }}>
          <iframe
            src={SATRAM_MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            aria-label="Map showing Mallavaram Brahmana Satram"
            allowFullScreen
          />
        </div>
        <div className="flex items-start">
          <a
            href={SATRAM_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block text-center w-full"
          >
            {language === "te" ? "సత్రం Google Maps లో తెరవండి" : "Open Satram in Google Maps"}
          </a>
        </div>
      </div>
    </SectionContainer>
  );
}
