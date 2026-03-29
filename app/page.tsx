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

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <AnnadanamSection />
      <ActivitiesSection />
      <DonationSection />
      <GallerySection />
      <VolunteerSection />
      <TransparencySection />
      <CommitteeSection />
      <ContactSection />
      <ConfigureSection />
    </>
  );
}

