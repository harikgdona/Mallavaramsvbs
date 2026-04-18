"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Great_Vibes } from "next/font/google";
import { useSiteManual, useTranslate } from "./ConfigProvider";
import { withBasePath } from "@/lib/basePath";
import { resolveGalleryImageSrc } from "@/lib/galleryConfig";
import { siteLeftMenuBackgroundFromConfig } from "@/lib/siteManualConfig";
import { resolveSiteManualForUi } from "@/lib/siteManualSchema";
import { useSectionTabs, type SectionId } from "./SectionTabs";
import { useLanguage } from "@/components/LanguageProvider";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

const navKeys = [
  "nav_home",
  "nav_about",
  "nav_temple-history",
  "nav_directions",
  "nav_annadanam",
  "nav_activities",
  "nav_donate",
  "nav_gallery",
  "nav_committee",
  "nav_contact",
  "nav_configure"
] as const;
const navItems = navKeys.map((key) => ({
  id: key.replace("nav_", ""),
  key
}));

function SidebarHostCredit({ size = "desktop" }: { size?: "desktop" | "mobile" }) {
  /* ~40% smaller than previous text-xl (1.25rem) / text-lg (1.125rem) */
  const nameClass = size === "mobile" ? "text-[0.675rem]" : "text-[0.75rem]";
  return (
    <div className="mt-4 shrink-0 border-t border-maroon/10 px-2 pt-2 pb-1 text-center">
      <p className="mb-0.5 text-[0.39rem] leading-tight text-text-dark/80">Built and hosted by</p>
      <p className={`${greatVibes.className} text-maroon ${nameClass}`}>Hari Krishna</p>
    </div>
  );
}

export function Header() {
  const t = useTranslate();
  const { language } = useLanguage();
  const { siteManual: raw } = useSiteManual();
  const c = resolveSiteManualForUi(raw);
  const [open, setOpen] = useState(false);
  const { activeSection, setActiveSection } = useSectionTabs();
  const SIDEBAR_WIDTH_PX = c.sidebarWidthPx;
  const leftMenuBg = siteLeftMenuBackgroundFromConfig(c);
  const mobileLogo = resolveGalleryImageSrc(
    c.topHeaderLogoSrc.trim() || "/images/logo.png",
    withBasePath("/images/logo.png")
  );

  return (
    <>
      {/* Desktop: left vertical sidebar — width matches TopHeader logo column */}
      <aside
        className="hidden md:flex md:min-h-0 md:flex-shrink-0 md:flex-col md:self-stretch border-r border-maroon/15 z-20 shadow-[inset_-1px_0_0_rgba(123,30,30,0.06)]"
        style={{
          width: SIDEBAR_WIDTH_PX,
          minWidth: SIDEBAR_WIDTH_PX,
          maxWidth: SIDEBAR_WIDTH_PX,
          background: leftMenuBg
        }}
        suppressHydrationWarning
      >
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-3">
          {navItems.map((item) => (
            <Fragment key={item.id}>
              <button
                type="button"
                onClick={() => setActiveSection(item.id as SectionId)}
                className={`app-nav-typography block w-full rounded-lg border py-2 px-2.5 text-center text-[0.875rem] leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 focus-visible:ring-offset-sandal ${
                  activeSection === item.id
                    ? "border-maroon/20 bg-white/80 text-maroon shadow-sm font-semibold"
                    : "border-transparent text-maroon/85 hover:border-maroon/10 hover:bg-white/70 hover:text-maroon hover:shadow-sm"
                }`}
              >
                {t(item.key)}
              </button>
              {item.id === "configure" ? (
                <div
                  className="shrink-0"
                  style={{ background: leftMenuBg }}
                >
                  <SidebarHostCredit size="desktop" />
                </div>
              ) : null}
            </Fragment>
          ))}
          <div className="min-h-0 flex-1 shrink" aria-hidden />
        </nav>
      </aside>

      {/* Mobile: compact top bar + hamburger menu (full width when layout stacks with flex-col). */}
      <header
        className="md:hidden sticky top-0 z-30 w-full flex-shrink-0 border-b border-maroon/10"
        style={{ backgroundColor: c.siteMobileNavBarBackground }}
        suppressHydrationWarning
      >
        <div
          id="site-mobile-nav-bar-top"
          className="flex items-center justify-between px-3 py-2 gap-2"
        >
          <button type="button" onClick={() => setActiveSection("home")} className="flex-shrink-0 flex items-center">
            <div className="relative h-10 w-10">
              <Image
                src={mobileLogo.src}
                alt=""
                fill
                sizes="40px"
                className="object-contain"
                priority
                unoptimized={mobileLogo.unoptimized}
              />
            </div>
          </button>
          <p className="font-heading min-w-0 flex-1 text-center text-sm leading-snug text-maroon break-words">
            {language === "te"
              ? "శ్రీ మల్లవరం వెంకటేశ్వర అన్నదాన సమాజం మరియు బ్రాహ్మణ సత్రం."
              : "Sri Mallavaram Brahmana Samajamu and Annadanam Satramu"}
          </p>
          <button
            type="button"
            className="flex-shrink-0 p-2 rounded-lg border border-maroon/40 text-maroon"
            onClick={() => setOpen((p) => !p)}
            aria-label="Menu"
          >
            <span className="block h-0.5 w-5 bg-maroon mb-1" />
            <span className="block h-0.5 w-5 bg-maroon mb-1" />
            <span className="block h-0.5 w-5 bg-maroon" />
          </button>
        </div>
        {open && (
          <div
            className="space-y-0 border-t border-maroon/10 px-2.5 pb-2"
            style={{ backgroundColor: c.siteMobileNavMenuBackground }}
            suppressHydrationWarning
          >
            {navItems.map((item) => (
              <Fragment key={item.id}>
                <button
                  type="button"
                  onClick={() => { setActiveSection(item.id as SectionId); setOpen(false); }}
                  className={`app-nav-typography block w-full rounded-md py-2 text-center text-sm leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 focus-visible:ring-offset-sandal ${
                    activeSection === item.id
                      ? "bg-white/80 text-maroon font-semibold"
                      : "text-maroon/85 hover:bg-white/80 hover:text-maroon"
                  }`}
                >
                  {t(item.key)}
                </button>
                {item.id === "configure" ? <SidebarHostCredit size="mobile" /> : null}
              </Fragment>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
