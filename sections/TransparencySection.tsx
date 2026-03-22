"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";

export function TransparencySection() {
  const t = useTranslate();

  return (
    <SectionContainer id="transparency">
      <h2 className="section-heading text-center">
        {t("transparency_title")}
      </h2>
      <p className="section-subtitle text-center max-w-2xl mx-auto mb-8">
        Donor trust is our foundation. All offerings are used carefully and
        respectfully for dharmic purposes only.
      </p>

      <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-5 text-sm md:text-base">
        <div className="bg-white rounded-3xl border border-maroon/10 shadow-sm px-4 py-4">
          <h3 className="font-heading text-maroon mb-1">Trust Registration</h3>
          <p className="text-text-dark/80">
            Registered charitable trust (details to be updated here).
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-maroon/10 shadow-sm px-4 py-4">
          <h3 className="font-heading text-maroon mb-1">80G / 12A</h3>
          <p className="text-text-dark/80">
            80G / 12A status and certificate details can be placed here for tax
            benefit information.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-maroon/10 shadow-sm px-4 py-4">
          <h3 className="font-heading text-maroon mb-1">Donation Usage</h3>
          <p className="text-text-dark/80">
            Offerings are primarily used for Annadanam, basic satram maintenance
            and genuine family necessities only.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}

