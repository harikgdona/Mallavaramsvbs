"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { SIDEBAR_WIDTH_PX } from "@/lib/sidebarWidth";

export function TopHeader() {
  return (
    <header className="w-full flex-shrink-0 bg-gold border-b border-maroon/20 z-30 h-[7.29rem] md:h-[9.72rem] relative">
      {/* Left logo — same width as sidebar below (lib/sidebarWidth) */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-stretch justify-center overflow-hidden shrink-0"
        style={{
          width: SIDEBAR_WIDTH_PX,
          minWidth: SIDEBAR_WIDTH_PX,
          maxWidth: SIDEBAR_WIDTH_PX
        }}
      >
        <Link
          href="/#home"
          className="relative block h-full min-h-0 w-full min-w-0"
          aria-label="Home"
        >
          <Image
            src={withBasePath("/images/logo.png")}
            alt=""
            fill
            sizes={`${SIDEBAR_WIDTH_PX}px`}
            className="object-contain object-center"
            priority
          />
        </Link>
      </div>

      {/* Right moola-virat (fixed 390px) */}
      <div className="absolute right-0 top-0 bottom-0 w-[390px] min-w-[390px] flex items-center justify-end">
        <div className="relative w-full h-full">
          <Image
            src={withBasePath("/images/moola-virat.png")}
            alt="Moola-virat"
            fill
            sizes="390px"
            className="object-contain object-right"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* Middle band between logo and moola-virat — text centered by transform (works with nowrap overflow) */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: SIDEBAR_WIDTH_PX, right: 390 }}
      >
        {/* Main title: true horizontal center of this band */}
        <div className="absolute left-[calc(50%+2cm)] top-[42%] w-max max-w-none -translate-x-1/2 -translate-y-1/2 px-2">
          <h1 className="font-heading font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-tight text-maroon text-bevel text-center whitespace-nowrap">
            శ్రీ మల్లవరం బ్రాహ్మణ సమాజము మరియు అన్నదాన సత్రము
          </h1>
        </div>
        {/* Address line: centered on same axis, pinned to bottom */}
        <p
          className="absolute left-[calc(50%+2cm)] bottom-1.5 w-max max-w-[calc(100%-1rem)] -translate-x-1/2 text-maroon/95 text-[0.6rem] sm:text-[0.65rem] md:text-xs font-semibold leading-tight whitespace-nowrap text-center px-1"
        >
          రి.నెం. 692/2022 మద్దిపాడు (మం), మల్లవరం గ్రామం, ప్రకాశం జిల్లా, ఆంధ్ర ప్రదేశ్
        </p>
      </div>

      {/* Accessibility: keep document flow height */}
      <div className="h-full" aria-hidden />
    </header>
  );
}
