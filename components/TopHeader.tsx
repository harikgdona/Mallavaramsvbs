"use client";

import Image from "next/image";
import Link from "next/link";

const SIDEBAR_WIDTH_PX = 195;

export function TopHeader() {
  return (
    <header className="w-full flex-shrink-0 bg-gold border-b border-maroon/20 z-30 h-36 md:h-48 relative">
      {/* Left logo (fixed width) */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center justify-center"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        <Link href="/#home" className="h-full w-full flex items-center justify-center" aria-label="Home">
          <div className="relative h-full w-full">
            <Image
              src="/images/logo.png"
              alt=""
              fill
              sizes={`${SIDEBAR_WIDTH_PX}px`}
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Right moola-virat (fixed 390px) */}
      <div className="absolute right-0 top-0 bottom-0 w-[390px] min-w-[390px] flex items-center justify-end">
        <div className="relative w-full h-full">
          <Image
            src="/images/moola-virat.png"
            alt="Moola-virat"
            fill
            sizes="390px"
            className="object-contain object-right"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      <div
        className="absolute top-0 bottom-0 flex flex-col items-center justify-end pb-1"
        style={{ left: SIDEBAR_WIDTH_PX, right: 390, transform: "translateX(3cm)" }}
      >
        <div className="flex-1 flex items-center justify-center min-h-0 w-full">
          <h1 className="font-heading font-bold text-2xl md:text-4xl leading-tight text-maroon text-bevel px-4 whitespace-nowrap text-center">
            శ్రీ మల్లవరం బ్రాహ్మణ సమాజము మరియు అన్నదాన సత్రము
          </h1>
        </div>
        <p
          className="text-maroon text-sm md:text-lg font-bold whitespace-nowrap px-4 text-center pb-1 flex-shrink-0"
          style={{ lineHeight: 1.2 }}
        >
          రి.నెం. 692/2022 మద్దిపాడు (మం), మల్లవరం గ్రామం, ప్రకాశం జిల్లా, ఆంధ్ర ప్రదేశ్
        </p>
      </div>

      {/* Accessibility: keep document flow height */}
      <div className="h-full" aria-hidden />
    </header>
  );
}
