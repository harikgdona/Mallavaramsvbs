/**
 * TopHeader — gold banner: logo | left lamp | (toranams + title + address) | right lamp | moola-virat.
 *
 * Tunables: Configure page (localStorage) or build defaults in lib/siteManualSchema.ts.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteManual } from "@/components/ConfigProvider";
import { withBasePath } from "@/lib/basePath";
import { topHeaderAddressFontSizeCss, topHeaderTitleFontSizeCss } from "@/lib/siteManualConfig";

export function TopHeader() {
  const { siteManual: c } = useSiteManual();

  const SIDEBAR_WIDTH_PX = c.sidebarWidthPx;
  const SITE_TOP_HEADER_BACKGROUND = c.siteTopHeaderBackground;
  const TOP_HEADER_HEIGHT_CLASSES = c.topHeaderHeightClasses;
  const TOP_HEADER_LEFT_LAMP_WIDTH_PX = c.topHeaderLeftLampWidthPx;
  const TOP_HEADER_RIGHT_LAMP_WIDTH_PX = c.topHeaderRightLampWidthPx;
  const TOP_HEADER_MOOLA_COLUMN_WIDTH_PX = c.topHeaderMoolaColumnWidthPx;
  const TOP_HEADER_MIDDLE_TEXT_ALIGN_LEFT = c.topHeaderMiddleTextAlignLeft;
  const TOP_HEADER_MIDDLE_TEXT_SHIFT_PX = c.topHeaderMiddleTextShiftPx;
  const TOP_HEADER_MIDDLE_TEXT_PUSH_DOWN_PX = c.topHeaderMiddleTextPushDownPx;
  const TOP_HEADER_TITLE_TO_ADDRESS_GAP_PX = c.topHeaderTitleToAddressGapPx;
  const HEADER_TORANAM_STRIP_HEIGHT_PX = c.headerToranamStripHeightPx;
  const HEADER_TORANAM_TILE_HEIGHT_PX = c.headerToranamTileHeightPx;
  const HEADER_TORANAM_TILE_WIDTH_PX = c.headerToranamTileWidthPx;
  const HEADER_TORANAM_GAP_PX = c.headerToranamGapPx;
  const HEADER_TORANAM_OBJECT_FIT = c.headerToranamObjectFit;
  const HEADER_TORANAM_TILE_COUNT = c.headerToranamTileCount;
  const HEADER_TORANAM_LEFT_PULL_PX = c.headerToranamLeftPullPx;
  const HEADER_TORANAM_SHIFT_UP_PX = c.headerToranamShiftUpPx;
  const TORANAM_IMAGE_PATHS = c.toranamImagePaths;

  // --- Middle band horizontal insets (px). Title + toranams live in this rectangle. ---
  const middleLeft = SIDEBAR_WIDTH_PX + TOP_HEADER_LEFT_LAMP_WIDTH_PX;
  const middleRight = TOP_HEADER_MOOLA_COLUMN_WIDTH_PX + TOP_HEADER_RIGHT_LAMP_WIDTH_PX;

  // --- Toranam row ---
  const toranamPaths = TORANAM_IMAGE_PATHS.slice(0, HEADER_TORANAM_TILE_COUNT); // files to render
  const toranamCount = toranamPaths.length;
  // Fluid column width string: (row width minus flex gaps) / number of tiles. Used only if TILE_WIDTH_PX === 0.
  const toranamFlexBasis =
    toranamCount > 0
      ? `calc((100% - ${(toranamCount - 1) * HEADER_TORANAM_GAP_PX}px) / ${toranamCount})`
      : "0px";
  // Tile box height: explicit TILE_HEIGHT from config, or fall back to strip height.
  const toranamTileHeightPx =
    HEADER_TORANAM_TILE_HEIGHT_PX > 0
      ? HEADER_TORANAM_TILE_HEIGHT_PX
      : HEADER_TORANAM_STRIP_HEIGHT_PX;
  // Outer toranam row wrapper height + title `top` offset — must fit the taller of strip vs tile.
  const toranamRowHeightPx = Math.max(HEADER_TORANAM_STRIP_HEIGHT_PX, toranamTileHeightPx);
  // Fixed-width mode: each column HEADER_TORANAM_TILE_WIDTH_PX px; else equal fluid columns.
  const toranamUseFixedWidth = HEADER_TORANAM_TILE_WIDTH_PX > 0;
  // flex shorthand: flex-grow flex-shrink flex-basis — 0 0 <width> keeps tiles from growing/shrinking away from basis.
  const toranamColFlex = toranamUseFixedWidth
    ? `0 0 ${HEADER_TORANAM_TILE_WIDTH_PX}px`
    : `0 0 ${toranamFlexBasis}`;
  // Next/Image `sizes` hint for srcset (does not change layout; only download resolution).
  const toranamSizesHint = toranamUseFixedWidth
    ? `${HEADER_TORANAM_TILE_WIDTH_PX}px`
    : "(max-width: 768px) 12vw, 96px";

  return (
    <header
      className={`hidden w-full flex-shrink-0 overflow-hidden border-b border-maroon/20 z-30 relative md:block ${TOP_HEADER_HEIGHT_CLASSES}`}
      style={{ backgroundColor: SITE_TOP_HEADER_BACKGROUND }}
    >
      {/* ========== LOGO COLUMN (width = SIDEBAR_WIDTH_PX from lib/sidebarWidth.ts) ========== */}
      <div
        // absolute left stack; flex centers logo vertically; overflow hidden clips oversized assets.
        className="absolute left-0 top-0 bottom-0 flex items-stretch justify-center overflow-hidden shrink-0"
        style={{
          width: SIDEBAR_WIDTH_PX,
          minWidth: SIDEBAR_WIDTH_PX,
          maxWidth: SIDEBAR_WIDTH_PX
        }}
      >
        <Link href="/#home" className="relative block h-full min-h-0 w-full min-w-0" aria-label="Home">
          <Image
            // [TWEAK] Logo file: change path in src= below (keep withBasePath).
            src={withBasePath("/images/logo.png")}
            alt=""
            fill
            sizes={`${SIDEBAR_WIDTH_PX}px`}
            className="object-contain object-center"
            priority
          />
        </Link>
      </div>

      {/* ========== LEFT LAMP (width = LEFT_LAMP_WIDTH_PX) ========== */}
      <div
        // z-[5] above toranam strip (z-[4]) so overlap from LEFT_PULL hides under lamp; pointer-events-none = decorative.
        className="absolute top-0 bottom-0 z-[5] flex items-stretch justify-center overflow-hidden pointer-events-none"
        style={{
          left: SIDEBAR_WIDTH_PX,
          width: TOP_HEADER_LEFT_LAMP_WIDTH_PX,
          minWidth: TOP_HEADER_LEFT_LAMP_WIDTH_PX,
          maxWidth: TOP_HEADER_LEFT_LAMP_WIDTH_PX
        }}
        aria-hidden
      >
        <div className="relative h-full w-full min-h-0">
          <Image
            // object-right-bottom + rotate-90: pin lamp art toward the *toranam* side of this column so wide
            // LEFT_LAMP_WIDTH_PX does not leave gold between the visible lamp and the first toranam.
            // If the lamp shifts the wrong way for your asset, try object-left-bottom again or object-right-top.
            src={withBasePath("/images/lamp-left.png")}
            alt=""
            fill
            sizes={`${TOP_HEADER_LEFT_LAMP_WIDTH_PX}px`}
            className="object-contain object-right-bottom rotate-90"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* ========== RIGHT LAMP ========== */}
      <div
        // right + width pins strip; z-[5] matches left lamp.
        className="absolute top-0 bottom-0 z-[5] flex items-stretch justify-center overflow-hidden pointer-events-none"
        style={{
          right: TOP_HEADER_MOOLA_COLUMN_WIDTH_PX,
          width: TOP_HEADER_RIGHT_LAMP_WIDTH_PX,
          minWidth: TOP_HEADER_RIGHT_LAMP_WIDTH_PX,
          maxWidth: TOP_HEADER_RIGHT_LAMP_WIDTH_PX
        }}
        aria-hidden
      >
        <div className="relative h-full w-full min-h-0">
          <Image
            // [TWEAK] Right lamp asset: src= and object-* classes.
            src={withBasePath("/images/lamp-right.png")}
            alt=""
            fill
            sizes={`${TOP_HEADER_RIGHT_LAMP_WIDTH_PX}px`}
            className="object-contain object-right-bottom"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* ========== MOOLA-VIRAT ========== */}
      <div
        // justify-end + inner object-right aligns deity to the viewport-right column edge.
        className="absolute right-0 top-0 bottom-0 flex items-center justify-end"
        style={{
          width: TOP_HEADER_MOOLA_COLUMN_WIDTH_PX,
          minWidth: TOP_HEADER_MOOLA_COLUMN_WIDTH_PX,
          maxWidth: TOP_HEADER_MOOLA_COLUMN_WIDTH_PX
        }}
      >
        <div className="relative w-full h-full">
          <Image
            // [TWEAK] Deity image: src=; object-right + object-contain control alignment inside column.
            src={withBasePath("/images/moola-virat.png")}
            alt="Moola-virat"
            fill
            sizes={`${TOP_HEADER_MOOLA_COLUMN_WIDTH_PX}px`}
            className="object-contain object-right"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* ========== MIDDLE BAND: toranams (top) + title + address ========== */}
      <div
        // pointer-events-none: decorative; relative: children absolute positions stack here; z-[4] under lamps (z-[5]).
        className="absolute top-0 bottom-0 pointer-events-none relative z-[4]"
        style={{
          left: middleLeft,
          right: middleRight
        }}
      >
        {/*
          Toranam strip wrapper — positioned at top of middle band. Pull: left negative + width calc extends
          the row leftward by HEADER_TORANAM_LEFT_PULL_PX (see lib/toranamStrip.ts). min-w-0 allows flex children to shrink.
        */}
        <div
          className="absolute top-0 overflow-hidden min-w-0"
          style={{
            height: toranamRowHeightPx,
            left: -HEADER_TORANAM_LEFT_PULL_PX,
            width: `calc(100% + ${HEADER_TORANAM_LEFT_PULL_PX}px)`,
            transform: `translateY(-${HEADER_TORANAM_SHIFT_UP_PX}px)`
          }}
          aria-hidden
        >
          {/*
            Flex row: flex-nowrap = one line; min-w-0 = respect parent width; gap from HEADER_TORANAM_GAP_PX.
            justify-start only in fixed tile width mode so tiles pack from the lamp side; fluid mode omits it (columns fill row).
            items-center = vertical center when tile height < row height.
          */}
          <div
            // justify-start: first toranam column always flush to strip’s left edge (fluid default is also flex-start; explicit for clarity).
            className={`flex h-full w-full min-w-0 flex-nowrap justify-start items-center`}
            style={{ gap: `${HEADER_TORANAM_GAP_PX}px` }}
          >
            {toranamPaths.map((src, i) => (
              <div
                key={`header-toranam-${i}-${src}`}
                // relative + min-w-0: Next/Image fill needs a positioned box; shrink-0 prevents flex from crushing basis incorrectly.
                className="relative shrink-0 min-w-0"
                style={{
                  height: toranamTileHeightPx,
                  flex: toranamColFlex
                }}
              >
                <Image
                  src={withBasePath(src)}
                  alt=""
                  fill
                  sizes={toranamSizesHint}
                  // object-left object-top: anchor art to top-left of cell (avoids false “gap” before first toranam from centering).
                  // mix-blend-multiply: white matting blends into the gold header so the box disappears (JPEG has no alpha).
                  className={
                    HEADER_TORANAM_OBJECT_FIT === "cover"
                      ? "object-cover object-left object-top mix-blend-multiply"
                      : "object-contain object-left object-top mix-blend-multiply"
                  }
                  unoptimized
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title + address */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex flex-col justify-center px-2 pb-1 ${
            TOP_HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "items-start" : "items-center"
          }`}
          style={{
            top: toranamRowHeightPx,
            paddingTop: TOP_HEADER_MIDDLE_TEXT_PUSH_DOWN_PX,
            gap: `${TOP_HEADER_TITLE_TO_ADDRESS_GAP_PX}px`,
            // translateX(0px) is a no-op when shift is 0; avoids TS narrowing on literal consts.
            transform: `translateX(${TOP_HEADER_MIDDLE_TEXT_SHIFT_PX}px)`
          }}
        >
          <h1
            className={`font-heading font-bold leading-tight text-maroon text-bevel max-w-full md:whitespace-nowrap ${
              TOP_HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "text-left" : "text-center"
            }`}
            style={{ fontSize: topHeaderTitleFontSizeCss(c) }}
          >
            శ్రీ మల్లవరం బ్రాహ్మణ సమాజము మరియు అన్నదాన సత్రము
          </h1>
          <p
            className={`max-w-full text-maroon/95 font-semibold leading-tight px-1 md:w-max md:max-w-[calc(100%-0.5rem)] md:whitespace-nowrap ${
              TOP_HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "text-left" : "text-center"
            }`}
            style={{ fontSize: topHeaderAddressFontSizeCss(c) }}
          >
            రి.నెం. 692/2022 మద్దిపాడు (మం), మల్లవరం గ్రామం, ప్రకాశం జిల్లా, ఆంధ్ర ప్రదేశ్
          </p>
        </div>
      </div>

      {/* In-flow spacer: absolute layers don’t affect parent height; this div matches header content box height. */}
      <div className="h-full" aria-hidden />
    </header>
  );
}
