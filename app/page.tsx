"use client";

import { useSectionTabs, type SectionId } from "@/components/SectionTabs";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { TempleHistorySection } from "@/sections/TempleHistorySection";
import { DirectionsSection } from "@/sections/DirectionsSection";
import { AnnadanamSection } from "@/sections/AnnadanamSection";
import { ActivitiesSection } from "@/sections/ActivitiesSection";
import { DonationSection } from "@/sections/DonationSection";
import { GallerySection } from "@/sections/GallerySection";
import { CommitteeSection } from "@/sections/CommitteeSection";
import { ContactSection } from "@/sections/ContactSection";
import { ConfigureSection } from "@/sections/ConfigureSection";

const sections: Record<SectionId, React.ComponentType> = {
  home: Hero,
  about: About,
  "temple-history": TempleHistorySection,
  directions: DirectionsSection,
  annadanam: AnnadanamSection,
  activities: ActivitiesSection,
  donate: DonationSection,
  gallery: GallerySection,
  committee: CommitteeSection,
  contact: ContactSection,
  configure: ConfigureSection,
};

export default function HomePage() {
  const { activeSection } = useSectionTabs();
  const ActiveComponent = sections[activeSection];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <ActiveComponent />
    </div>
  );
}
