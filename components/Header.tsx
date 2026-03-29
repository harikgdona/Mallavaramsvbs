"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Great_Vibes } from "next/font/google";
import { useSiteManual, useTranslate } from "./ConfigProvider";
import { withBasePath } from "@/lib/basePath";
import { siteLeftMenuBackgroundFromConfig } from "@/lib/siteManualConfig";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

const navKeys = [
  "nav_home",
  "nav_about",
  "nav_annadanam",
  "nav_activities",
  "nav_donate",
  "nav_gallery",
  "nav_volunteer",
  "nav_contact",
  "nav_configure"
] as const;
const navItems = navKeys.map((key) => ({
  id: key.replace("nav_", ""),
  key
}));

export function Header() {
  const t = useTranslate();
  const { siteManual: c } = useSiteManual();
  const [open, setOpen] = useState(false);
  const SIDEBAR_WIDTH_PX = c.sidebarWidthPx;
  const leftMenuBg = siteLeftMenuBackgroundFromConfig(c);

  return (
    <>
      {/* Desktop: left vertical sidebar — width matches TopHeader logo column */}
      <aside
        className="hidden md:flex md:flex-col md:flex-shrink-0 md:sticky md:top-0 md:self-start md:h-screen md:max-h-screen border-r border-maroon/15 z-20 shadow-[inset_-1px_0_0_rgba(123,30,30,0.06)]"
        style={{
          minHeight: 0,
          width: SIDEBAR_WIDTH_PX,
          minWidth: SIDEBAR_WIDTH_PX,
          maxWidth: SIDEBAR_WIDTH_PX,
          background: leftMenuBg
        }}
      >
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5 min-h-0">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={withBasePath(`/#${item.id}`)}
              className="block font-heading text-[0.95rem] font-semibold not-italic text-maroon/85 hover:text-maroon hover:bg-white/70 py-2.5 px-3 rounded-xl transition-colors text-center border border-transparent hover:border-maroon/10 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 focus-visible:ring-offset-sandal"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex-shrink-0 px-3 pb-4 pt-6 text-center border-t border-maroon/10 mt-auto">
          <p className="text-xs text-text-dark/80 mb-1.5">Built and hosted by</p>
          <p className={`text-2xl ${greatVibes.className} text-maroon`}>
            Hari Krishna
          </p>
        </div>
      </aside>

      {/* Mobile: compact top bar + hamburger menu (full width when layout stacks with flex-col). */}
      <header
        className="md:hidden sticky top-0 z-30 w-full flex-shrink-0 border-b border-maroon/10"
        style={{ backgroundColor: c.siteMobileNavBarBackground }}
      >
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <Link href="/#home" className="flex-shrink-0 flex items-center">
            <div className="relative h-10 w-10">
              <Image
                src={withBasePath("/images/logo.png")}
                alt=""
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <p className="font-heading font-bold text-sm text-maroon whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 text-center">
            Sri Mallavaram Venkateswara Annadaana Samajamu &amp; Brahmana Satramu
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
            className="border-t border-maroon/10 px-3 pb-3 space-y-0.5"
            style={{ backgroundColor: c.siteMobileNavMenuBackground }}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={withBasePath(`/#${item.id}`)}
                className="block font-heading text-base font-semibold not-italic py-2.5 text-maroon/85 hover:text-maroon hover:bg-white/80 rounded-lg text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon/35 focus-visible:ring-offset-2 focus-visible:ring-offset-sandal"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
            <div className="pt-4 mt-3 border-t border-maroon/10 text-center">
              <p className="text-xs text-text-dark/80 mb-1">Built and hosted by</p>
              <p className={`text-xl ${greatVibes.className} text-maroon`}>Hari Krishna</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
