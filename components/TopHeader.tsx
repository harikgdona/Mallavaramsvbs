/**
 * TopHeader — gold banner: logo | left lamp | (toranams + title + address) | right lamp | moola-virat.
 *
 * =============================================================================
 * TWEAK MAP — what to change for common goals (search this file for the name)
 * =============================================================================
 *
 * TORANAMS → lib/toranamStrip.ts
 *   • Row height (band + title offset)     HEADER_TORANAM_STRIP_HEIGHT_PX
 *   • Each tile HEIGHT (px)                HEADER_TORANAM_TILE_HEIGHT_PX (0 = use strip height)
 *   • Each tile WIDTH (px)                 HEADER_TORANAM_TILE_WIDTH_PX (0 = equal columns from TILE_COUNT)
 *   • How many tiles (fluid width mode)    HEADER_TORANAM_TILE_COUNT
 *   • Gap between tiles                    HEADER_TORANAM_GAP_PX
 *   • Pull row left toward lamp            HEADER_TORANAM_LEFT_PULL_PX
 *   • cover vs contain                     HEADER_TORANAM_OBJECT_FIT
 *   • Images list                          TORANAM_IMAGE_PATHS
 *   Images use object-left in JSX so pixels hug the left edge of each cell (reduces “gap” before
 *   the first toranam vs default centered object-position). Remaining gold is usually empty lamp
 *   column — then raise LEFT_PULL or lower LEFT_LAMP_WIDTH_PX in this file.
 *
 * LOGO COLUMN WIDTH (and alignment with sidebar below)
 *   → lib/sidebarWidth.ts — SIDEBAR_WIDTH_PX
 *   Used here on the logo column `style.width` and left-lamp `left`.
 *
 * MOOLA (deity) COLUMN + GAP BEFORE SWAMY + RIGHT LAMP ANCHOR
 *   → this file: MOOLA_COLUMN_WIDTH_PX (~const block below)
 *
 * LAMP STRIP WIDTHS
 *   → this file: LEFT_LAMP_WIDTH_PX, RIGHT_LAMP_WIDTH_PX
 *
 * MIDDLE BAND horizontal position (where toranams + text sit)
 *   → derived: middleLeft = SIDEBAR + LEFT_LAMP, middleRight = MOOLA + RIGHT_LAMP
 *   Tweak the lamp/moola constants above; do not edit middleLeft/middleRight formulas unless you know the layout.
 *
 * MAIN TITLE (Telugu h1) SIZE
 *   → this file: HEADER_TITLE_FONT_FIXED_REM (if > 0, wins) or MIN / PREF_VW / MAX for clamp mode
 *
 * TITLE + ADDRESS horizontal position (center vs left, fine nudge)
 *   → this file: HEADER_MIDDLE_TEXT_ALIGN_LEFT, HEADER_MIDDLE_TEXT_SHIFT_PX
 *
 * TITLE + ADDRESS vertical spacing
 *   → HEADER_MIDDLE_TEXT_PUSH_DOWN_PX (padding-top: whole block lower under toranams)
 *   → HEADER_TITLE_TO_ADDRESS_GAP_PX (space between h1 line and address line)
 *
 * ADDRESS LINE (p) SIZE
 *   → this file: HEADER_ADDRESS_FONT_* (same pattern as title)
 *
 * WHOLE HEADER BAR HEIGHT (toranam row + title block)
 *   → this file: <header> className `h-[8.85rem] md:h-[10.85rem]` — change rem values if you need more/less vertical room
 *
 * LOGO / LAMP / MOOLA *IMAGE FILES*
 *   → public/images/… paths in JSX `src={withBasePath("...")}` (search `/images/`)
 *
 * =============================================================================
 * Z-INDEX: lamps z-[5], middle band z-[4], header z-30 (stacking context for page).
 * =============================================================================
 */
"use client";

// --- Imports ---
// Next/Image: `fill` = size to parent; parent must be `position: relative` with defined size.
import Image from "next/image";
// Logo link target.
import Link from "next/link";
// GitHub Pages subpath prefix for /public assets.
import { withBasePath } from "@/lib/basePath";
// Logo column width — MUST match desktop sidebar (see lib/sidebarWidth.ts to change).
import { SIDEBAR_WIDTH_PX } from "@/lib/sidebarWidth";
// Toranam strip: all tunables live in this file (see TWEAK MAP at top).
import {
  HEADER_TORANAM_GAP_PX,
  HEADER_TORANAM_LEFT_PULL_PX,
  HEADER_TORANAM_OBJECT_FIT,
  HEADER_TORANAM_STRIP_HEIGHT_PX,
  HEADER_TORANAM_TILE_COUNT,
  HEADER_TORANAM_TILE_HEIGHT_PX,
  HEADER_TORANAM_TILE_WIDTH_PX,
  TORANAM_IMAGE_PATHS
} from "@/lib/toranamStrip";

// =============================================================================
// [TWEAK] Layout — moola column + lamp strips (px)
// =============================================================================

/**
 * [TWEAK] MOOLA_COLUMN_WIDTH_PX — Moola-virat column width; also `right:` offset for the right lamp.
 * Smaller → less empty gold left of deity (if using object-right); right lamp moves with this edge.
 */
const MOOLA_COLUMN_WIDTH_PX = 112;

/**
 * [TWEAK] LEFT_LAMP_WIDTH_PX — Horizontal strip for left lamp art; starts at SIDEBAR_WIDTH_PX.
 * Wider column does not auto-fill with lamp pixels: the lamp Image uses object-contain + rotate, so extra width
 * becomes header gold *inside this strip* (looks like a gap before toranams). Fix without shrinking the column:
 * keep object-right-bottom on the left lamp so art hugs the toranam-facing edge (see lamp Image className below).
 */
const LEFT_LAMP_WIDTH_PX = 165;

/**
 * [TWEAK] RIGHT_LAMP_WIDTH_PX — Right lamp strip; its inner edge touches moola column.
 * Wider → middle band narrows from the right.
 */
const RIGHT_LAMP_WIDTH_PX = 110;

// =============================================================================
// [TWEAK] Typography — title (h1) and address (p)
// =============================================================================

/**
 * Title (h1) typography — if HEADER_TITLE_FONT_FIXED_REM > 0, that single rem size wins (simplest knob).
 * Otherwise CSS clamp(MIN, PREF_VW*vw, MAX): changing MIN rarely matters on phones; lower MAX or PREF_VW to shrink.
 */
const HEADER_TITLE_FONT_FIXED_REM = 1.55;
const HEADER_TITLE_FONT_MIN_REM = 1.125;
const HEADER_TITLE_FONT_PREF_VW = 3.6;
const HEADER_TITLE_FONT_MAX_REM = 1.9;

/** Address (p): HEADER_ADDRESS_FONT_FIXED_REM > 0 uses fixed rem; else same clamp pattern as title. */
const HEADER_ADDRESS_FONT_FIXED_REM = 0.8;
const HEADER_ADDRESS_FONT_MIN_REM = 0.72;
const HEADER_ADDRESS_FONT_PREF_VW = 2;
const HEADER_ADDRESS_FONT_MAX_REM = 1.05;

/**
 * false = title + address centered in the middle band (default).
 * true = align both to the left edge of the middle band (under toranams area).
 */
const HEADER_MIDDLE_TEXT_ALIGN_LEFT = true;

/**
 * Nudge the whole title+address block horizontally (px). Negative = left, positive = right.
 * Works with center or left align; small values (e.g. -12, -24) fine-tune position.
 */
const HEADER_MIDDLE_TEXT_SHIFT_PX = -45;

/**
 * Push the title + address block downward (px) inside the band below the toranam strip.
 * Uses padding-top on the wrapper; increase if the heading sits too high.
 */
const HEADER_MIDDLE_TEXT_PUSH_DOWN_PX = 40;

/**
 * Vertical gap between the main title (h1) and the address line (p), in px.
 * Replaces a fixed Tailwind gap; 0 = lines almost touch (still subject to line-height).
 */
const HEADER_TITLE_TO_ADDRESS_GAP_PX = 30;

/** Title font-size CSS value: fixed rem, or clamp() from MIN / vw / MAX (see constants above). */
function headerTitleFontSize(): string {
  if (HEADER_TITLE_FONT_FIXED_REM > 0) {
    return `${HEADER_TITLE_FONT_FIXED_REM}rem`;
  }
  const lo = Math.min(HEADER_TITLE_FONT_MIN_REM, HEADER_TITLE_FONT_MAX_REM);
  const hi = Math.max(HEADER_TITLE_FONT_MIN_REM, HEADER_TITLE_FONT_MAX_REM);
  return `clamp(${lo}rem, ${HEADER_TITLE_FONT_PREF_VW}vw, ${hi}rem)`;
}

/** Address line font-size: same pattern as headerTitleFontSize(). */
function headerAddressFontSize(): string {
  if (HEADER_ADDRESS_FONT_FIXED_REM > 0) {
    return `${HEADER_ADDRESS_FONT_FIXED_REM}rem`;
  }
  const lo = Math.min(HEADER_ADDRESS_FONT_MIN_REM, HEADER_ADDRESS_FONT_MAX_REM);
  const hi = Math.max(HEADER_ADDRESS_FONT_MIN_REM, HEADER_ADDRESS_FONT_MAX_REM);
  return `clamp(${lo}rem, ${HEADER_ADDRESS_FONT_PREF_VW}vw, ${hi}rem)`;
}

export function TopHeader() {
  // --- Middle band horizontal insets (px). Title + toranams live in this rectangle. ---
  const middleLeft = SIDEBAR_WIDTH_PX + LEFT_LAMP_WIDTH_PX; // distance from viewport left to middle band
  const middleRight = MOOLA_COLUMN_WIDTH_PX + RIGHT_LAMP_WIDTH_PX; // distance from viewport right to middle band

  // --- Toranam row: derived values (tunables live in lib/toranamStrip.ts — see that file’s header comment) ---
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
    // <header> — w-full: span viewport; flex-shrink-0: don’t squash in flex parents; overflow-hidden: clip decor;
    // bg-gold / border: theme; z-30: above page; h-[8.85rem] md:h-[10.85rem]: total bar height (TWEAK if title/toranams clip);
    // relative: positioning context for absolute children.
    <header className="w-full flex-shrink-0 overflow-hidden bg-gold border-b border-maroon/20 z-30 h-[8.7rem] md:h-[9.9rem] relative">
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
          width: LEFT_LAMP_WIDTH_PX,
          minWidth: LEFT_LAMP_WIDTH_PX,
          maxWidth: LEFT_LAMP_WIDTH_PX
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
            sizes={`${LEFT_LAMP_WIDTH_PX}px`}
            className="object-contain object-right-bottom rotate-90"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* ========== RIGHT LAMP (width = RIGHT_LAMP_WIDTH_PX) ========== */}
      <div
        // right + width pins strip; z-[5] matches left lamp.
        className="absolute top-0 bottom-0 z-[5] flex items-stretch justify-center overflow-hidden pointer-events-none"
        style={{
          right: MOOLA_COLUMN_WIDTH_PX,
          width: RIGHT_LAMP_WIDTH_PX,
          minWidth: RIGHT_LAMP_WIDTH_PX,
          maxWidth: RIGHT_LAMP_WIDTH_PX
        }}
        aria-hidden
      >
        <div className="relative h-full w-full min-h-0">
          <Image
            // [TWEAK] Right lamp asset: src= and object-* classes.
            src={withBasePath("/images/lamp-right.png")}
            alt=""
            fill
            sizes={`${RIGHT_LAMP_WIDTH_PX}px`}
            className="object-contain object-right-bottom"
            loading="eager"
            unoptimized
          />
        </div>
      </div>

      {/* ========== MOOLA-VIRAT (width = MOOLA_COLUMN_WIDTH_PX) ========== */}
      <div
        // justify-end + inner object-right aligns deity to the viewport-right column edge.
        className="absolute right-0 top-0 bottom-0 flex items-center justify-end"
        style={{
          width: MOOLA_COLUMN_WIDTH_PX,
          minWidth: MOOLA_COLUMN_WIDTH_PX,
          maxWidth: MOOLA_COLUMN_WIDTH_PX
        }}
      >
        <div className="relative w-full h-full">
          <Image
            // [TWEAK] Deity image: src=; object-right + object-contain control alignment inside column.
            src={withBasePath("/images/moola-virat.png")}
            alt="Moola-virat"
            fill
            sizes={`${MOOLA_COLUMN_WIDTH_PX}px`}
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
            width: `calc(100% + ${HEADER_TORANAM_LEFT_PULL_PX}px)`
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
                  className={
                    HEADER_TORANAM_OBJECT_FIT === "cover"
                      ? "object-cover object-left object-top"
                      : "object-contain object-left object-top"
                  }
                  unoptimized
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title + address: align/shift/push-down/gap — constants in [TWEAK] Typography section above. */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex flex-col justify-center px-2 pb-1 ${
            HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "items-start" : "items-center"
          }`}
          style={{
            top: toranamRowHeightPx,
            paddingTop: HEADER_MIDDLE_TEXT_PUSH_DOWN_PX,
            gap: `${HEADER_TITLE_TO_ADDRESS_GAP_PX}px`,
            // translateX(0px) is a no-op when shift is 0; avoids TS narrowing on literal consts.
            transform: `translateX(${HEADER_MIDDLE_TEXT_SHIFT_PX}px)`
          }}
        >
          <h1
            className={`font-heading font-bold leading-tight text-maroon text-bevel whitespace-nowrap max-w-full ${
              HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "text-left" : "text-center"
            }`}
            style={{ fontSize: headerTitleFontSize() }}
          >
            శ్రీ మల్లవరం బ్రాహ్మణ సమాజము మరియు అన్నదాన సత్రము
          </h1>
          <p
            className={`w-max max-w-[calc(100%-0.5rem)] text-maroon/95 font-semibold leading-tight whitespace-nowrap px-1 ${
              HEADER_MIDDLE_TEXT_ALIGN_LEFT ? "text-left" : "text-center"
            }`}
            style={{ fontSize: headerAddressFontSize() }}
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
