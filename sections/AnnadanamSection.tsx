"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";
import { withBasePath } from "@/lib/basePath";

export function AnnadanamSection() {
  const t = useTranslate();

  return (
    <SectionContainer id="annadanam" className="bg-sandal/60">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="section-heading">{t("annadanam_title")}</h2>
          <p className="section-subtitle mb-4">
            {t("annadanam_body")}
          </p>

          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center mb-4">
            <div className="bg-white rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-sm border border-maroon/10">
              <p className="text-xs md:text-sm text-text-dark/70">Meals served</p>
              <p className="font-heading text-lg md:text-2xl text-maroon mt-1">
                50,000+
              </p>
            </div>
            <div className="bg-white rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-sm border border-maroon/10">
              <p className="text-xs md:text-sm text-text-dark/70">Families supported</p>
              <p className="font-heading text-lg md:text-2xl text-maroon mt-1">
                150+
              </p>
            </div>
            <div className="bg-white rounded-2xl px-3 py-3 md:px-4 md:py-4 shadow-sm border border-maroon/10">
              <p className="text-xs md:text-sm text-text-dark/70">Years of seva</p>
              <p className="font-heading text-lg md:text-2xl text-maroon mt-1">10+</p>
            </div>
          </div>

          <p className="text-sm md:text-base text-text-dark/80">
            {t("annadanam_stats")}
          </p>
        </div>

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
      </div>
    </SectionContainer>
  );
}

