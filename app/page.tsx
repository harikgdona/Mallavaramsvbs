"use client";

import { useSectionTabs, type SectionId } from "@/components/SectionTabs";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { AnnadanamSection } from "@/sections/AnnadanamSection";
import { ActivitiesSection } from "@/sections/ActivitiesSection";
import { DonationSection } from "@/sections/DonationSection";
import { GallerySection } from "@/sections/GallerySection";
import { VolunteerSection } from "@/sections/VolunteerSection";
import { TransparencySection } from "@/sections/TransparencySection";
import { CommitteeSection } from "@/sections/CommitteeSection";
import { ContactSection } from "@/sections/ContactSection";
import { ConfigureSection } from "@/sections/ConfigureSection";

const sections: Record<SectionId, React.ComponentType> = {
  home: Hero,
  about: About,
  annadanam: AnnadanamSection,
  activities: ActivitiesSection,
  donate: DonationSection,
  gallery: GallerySection,
  volunteer: VolunteerSection,
  transparency: TransparencySection,
  committee: CommitteeSection,
  contact: ContactSection,
  configure: ConfigureSection,
};

export default function HomePage() {
  const { activeSection } = useSectionTabs();
  const ActiveComponent = sections[activeSection];

  return (
    <div className="flex-1 overflow-y-auto">
      <ActiveComponent />
    </div>
  );
}
