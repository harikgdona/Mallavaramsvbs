"use client";

import Image from "next/image";
import { SectionContainer } from "@/components/SectionContainer";
import { useTranslate } from "@/components/ConfigProvider";

const galleryItems = [
  { src: "/images/placeholder.svg", alt: "Annadanam serving hall" },
  { src: "/images/placeholder.svg", alt: "Devotees receiving prasadam" },
  { src: "/images/placeholder.svg", alt: "Temple and satram view" },
  { src: "/images/placeholder.svg", alt: "Veda pandits performing parayanam" }
];

export function GallerySection() {
  const t = useTranslate();

  return (
    <SectionContainer id="gallery">
      <h2 className="section-heading text-center">
        {t("gallery_title")}
      </h2>
      <p className="section-subtitle text-center max-w-2xl mx-auto mb-8">
        Glimpses of Annadanam, satram ambience and dharmic activities
        at Mallavaram.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="relative h-32 sm:h-36 md:h-40 lg:h-44 rounded-2xl overflow-hidden border border-maroon/15 shadow-sm"
          >
            <Image src={item.src} alt={item.alt} fill className="object-cover" unoptimized />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

