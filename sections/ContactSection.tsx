"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// TODO: replace with the actual trust phone number
const PHONE_DISPLAY = "+91 YOUR_NUMBER";
const PHONE_TEL = "+91YOUR_NUMBER";
const EMAIL = "info@MallavaramBrahmanasatram.org";
// Mallavaram village, Maddipadu mandal, Prakasam district, AP (15.5167°N 79.9167°E approx)
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15360.0!2d79.9167!3d15.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4b3e0000000001%3A0x0!2sMallavaram%2C%20Prakasam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1711800000000";

export function ContactSection() {
  const t = useTranslate();

  return (
    <SectionContainer id="contact">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="section-heading">
            {t("contact_title")}
          </h2>
          <p className="section-subtitle mb-5">
            For Annadanam sponsorship, special family sevas, or queries related
            to the satram, please reach out.
          </p>

          <div className="space-y-3 text-sm md:text-base text-text-dark/85">
            <p>
              <span className="font-semibold">Phone: </span>
              <a href={`tel:${PHONE_TEL}`} className="hover:underline">
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              <a href={`mailto:${EMAIL}`} className="hover:underline break-all">
                {EMAIL}
              </a>
            </p>
            <p>
              <span className="font-semibold">Address: </span>
              <span>
                Sri Mallavaram Venkateswara Annadaana Samajamu mariyu Brahmana
                Satramu, Mallavaram Village, Prakasam District, Andhra Pradesh,
                India.
              </span>
            </p>
          </div>

          <div className="mt-4">
            <WhatsAppButton />
          </div>
        </div>

        <div className="w-full h-64 md:h-72 lg:h-80 rounded-3xl overflow-hidden border border-maroon/15 shadow-md">
          <iframe
            src={MAP_EMBED_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
            aria-label="Map showing Mallavaram village in Prakasam district, Andhra Pradesh"
          />
        </div>
      </div>
    </SectionContainer>
  );
}

