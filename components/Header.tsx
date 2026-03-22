"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Great_Vibes } from "next/font/google";
import { useTranslate } from "./ConfigProvider";
import { withBasePath } from "@/lib/basePath";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: left vertical sidebar, width 0.75x (195px) */}
      <aside
        className="hidden md:flex md:flex-col md:w-[195px] md:flex-shrink-0 md:sticky md:top-0 md:self-start md:h-screen md:max-h-screen bg-header-yellow border-r border-maroon/10 z-20"
        style={{ minHeight: 0 }}
      >
        {/* Vertical menu: bold, bevel, opens new tab */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 min-h-0 pt-6">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={withBasePath(`/#${item.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xl font-bold italic text-text-dark/90 hover:text-maroon hover:bg-yellow-200/60 py-2 px-3 rounded-lg transition text-bevel text-center"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        {/* Built and hosted by — exactly 2 cm below last menu item (Configure) */}
        <div
          className="flex-shrink-0 px-3 pb-3 text-center"
          style={{ marginTop: "2cm" }}
        >
          <p className="text-xs text-text-dark/80 mb-1.5">Built and hosted by</p>
          <p className={`text-2xl ${greatVibes.className} text-maroon`}>
            Hari Krishna
          </p>
        </div>
      </aside>

      {/* Mobile: compact top bar + hamburger menu */}
      <header className="md:hidden sticky top-0 z-30 bg-header-yellow border-b border-maroon/10">
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
          <div className="border-t border-maroon/10 px-3 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={withBasePath(`/#${item.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base font-bold italic py-2 text-text-dark/90 hover:text-maroon text-bevel text-center"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
            <div className="pt-2 border-t border-maroon/10 text-center" style={{ marginTop: "2cm" }}>
              <p className="text-xs text-text-dark/80 mb-1">Built and hosted by</p>
              <p className={`text-xl ${greatVibes.className} text-maroon`}>Hari Krishna</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
