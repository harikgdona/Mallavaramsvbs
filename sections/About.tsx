"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";

export function About() {
  const t = useTranslate();

  return (
    <SectionContainer id="about">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="section-heading">{t("about_title")}</h2>
          <p className="section-subtitle mb-4">
            {t("about_body")}
          </p>
          <p className="text-sm md:text-base text-text-dark/80">
            The satram offers a simple, clean and devotional space where pilgrims,
            Veda pandits and local families can rest, receive prasadam and participate
            in traditional dharmic activities with dignity and respect.
          </p>
        </div>
        <div className="bg-white rounded-3xl shadow-md border border-maroon/10 p-5 md:p-6">
          <h3 className="font-heading text-lg md:text-xl text-maroon mb-3">
            Mallavaram – A Village of Dharma
          </h3>
          <p className="text-sm md:text-base text-text-dark/80 mb-3">
            Mallavaram is a small village in Prakasam district, Andhra Pradesh, with
            a rich tradition of Vedic learning and temple worship. Many elderly and
            poor Brahmin families reside here with limited income.
          </p>
          <p className="text-sm md:text-base text-text-dark/80">
            Through this trust, devotees across India and abroad can directly support
            these families and sustain the dharmic atmosphere of the village.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}

