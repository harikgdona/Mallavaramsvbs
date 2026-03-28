/**
 * =============================================================================
 * lib/toranamStrip.ts — Toranam strip configuration (header + gallery defaults)
 * =============================================================================
 *
 * CONSUMERS
 *   • components/TopHeader.tsx — reads every export below to render the toranam row.
 *   • lib/galleryConfig.ts — uses TORANAM_IMAGE_PATHS to pre-fill default gallery slots.
 *
 * HOW TOPHEADER USES THESE VALUES (read with TopHeader.tsx open)
 *   1. TORANAM_IMAGE_PATHS + HEADER_TORANAM_TILE_COUNT
 *      → slice(...) = which files appear, in order (first N paths).
 *   2. HEADER_TORANAM_TILE_WIDTH_PX === 0 (fluid mode)
 *      → each column width = (100% − gaps) ÷ tile count (see toranamFlexBasis in TopHeader).
 *   3. HEADER_TORANAM_TILE_WIDTH_PX  > 0 (fixed mode)
 *      → each column is exactly that many px wide; flex row uses justify-start (packs from left lamp).
 *   4. HEADER_TORANAM_TILE_HEIGHT_PX === 0
 *      → tile box height = HEADER_TORANAM_STRIP_HEIGHT_PX.
 *   5. HEADER_TORANAM_TILE_HEIGHT_PX  > 0
 *      → tile box is that tall; row band height = max(STRIP_HEIGHT, TILE_HEIGHT).
 *   6. HEADER_TORANAM_GAP_PX → CSS gap between flex columns (string `${n}px` in TopHeader).
 *   7. HEADER_TORANAM_LEFT_PULL_PX → negative left + wider width on strip (slides row toward lamp).
 *   8. HEADER_TORANAM_OBJECT_FIT → object-cover vs object-contain on each Next/Image (plus object-left).
 *
 * QUICK TWEAK MAP
 *   Goal                              Change this constant (below)
 *   ------------------------------    ---------------------------------
 *   Swap / reorder images             TORANAM_IMAGE_PATHS
 *   Fewer / more toranams in header   HEADER_TORANAM_TILE_COUNT (and/or shorten PATHS)
 *   Taller / shorter row band         HEADER_TORANAM_STRIP_HEIGHT_PX
 *   Exact thumbnail height            HEADER_TORANAM_TILE_HEIGHT_PX (0 = match strip)
 *   Exact thumbnail width             HEADER_TORANAM_TILE_WIDTH_PX (0 = equal fluid columns)
 *   Space between pictures            HEADER_TORANAM_GAP_PX
 *   Move row left (toward lamp)       HEADER_TORANAM_LEFT_PULL_PX
 *   Crop to fill vs letterbox         HEADER_TORANAM_OBJECT_FIT
 *
 * FILES ON DISK
 *   Paths are under public/ — must match filename casing (Linux + GitHub Pages are case-sensitive).
 *
 * YELLOW GAP BETWEEN LEFT LAMP AND FIRST TORANAM (most common causes)
 *   1) Gold *inside the lamp column* (not toranam): wide LEFT_LAMP_WIDTH_PX + object-contain + rotate leaves
 *      empty strip on the toranam-facing side if the image is anchored toward the logo. TopHeader uses
 *      object-right-bottom on the left lamp so art hugs the edge next to toranams; tweak that class if your PNG needs it.
 *   2) Still overlap: raise HEADER_TORANAM_LEFT_PULL_PX (whole px, e.g. 40–120) to slide toranams left under the lamp z-layer.
 *   3) White / padding inside the toranam file — crop the asset; transparent PNG blends with gold.
 *
 * =============================================================================
 */

/**
 * Ordered list of site-relative image paths for toranams.
 * TopHeader only shows the first HEADER_TORANAM_TILE_COUNT entries (slice).
 * Add/remove/reorder strings here; ensure matching files exist in public/images/.
 */
export const TORANAM_IMAGE_PATHS = [
  "/images/toranam-1.jpeg",
  "/images/Toranam-2.jpeg",
  "/images/Toranam-3.jpeg",
  "/images/toranam-4.png",
  "/images/toranam-5.png"
] as const;

/**
 * HEADER_TORANAM_STRIP_HEIGHT_PX
 * -----------------
 * The toranam *row container* height in px. Also used as the default tile height when
 * HEADER_TORANAM_TILE_HEIGHT_PX is 0.
 * The title block in TopHeader starts below max(STRIP_HEIGHT, TILE_HEIGHT).
 * Raise if tiles or row feel clipped; lower for a shorter strip (thumbnails shrink with the box).
 */
export const HEADER_TORANAM_STRIP_HEIGHT_PX = 76;

/**
 * HEADER_TORANAM_TILE_HEIGHT_PX
 * -----------------
 * Explicit height of each toranam *cell* (the box the Next/Image fills).
 * • 0 → use HEADER_TORANAM_STRIP_HEIGHT_PX for both strip and cell (simplest).
 * • >0 and < STRIP_HEIGHT → shorter tiles vertically centered in the row (items-center).
 * • > STRIP_HEIGHT → row grows to fit; keep STRIP ≥ tile height in normal layouts.
 */
export const HEADER_TORANAM_TILE_HEIGHT_PX = 70;

/**
 * HEADER_TORANAM_TILE_WIDTH_PX
 * -----------------
 * Explicit width of each toranam *column* in px.
 * • 0 → *fluid* mode: divide the middle band evenly among visible tiles (see TILE_COUNT).
 * • >0 → *fixed* mode: each tile is this wide; row aligns tiles from the start (justify-start),
 *        so the first toranam sits closest to the left lamp. Remaining row width may stay empty on the right.
 */
export const HEADER_TORANAM_TILE_WIDTH_PX = 250;

/**
 * HEADER_TORANAM_GAP_PX
 * -----------------
 * Horizontal gap between adjacent toranam columns (flex gap). Use 0 for none.
 * Must be a whole number; TopHeader applies it as `${HEADER_TORANAM_GAP_PX}px`.
 */
export const HEADER_TORANAM_GAP_PX = 0;

/**
 * HEADER_TORANAM_OBJECT_FIT
 * -----------------
 * How the bitmap fits inside each fixed-size cell (Next/Image fill + object-*).
 * • "cover" — fills the cell; may crop. Good for dense strips with object-left object-top in TopHeader.
 * • "contain" — entire image visible; often leaves empty gold inside the cell if aspect ratio differs.
 */
export const HEADER_TORANAM_OBJECT_FIT: "contain" | "cover" = "cover";

/**
 * HEADER_TORANAM_TILE_COUNT
 * -----------------
 * Maximum number of toranams drawn in the header (first N paths after slice).
 * In fluid width mode (TILE_WIDTH_PX === 0), more tiles = narrower columns per tile.
 * In fixed width mode, count still limits how many images are rendered; each stays TILE_WIDTH_PX wide.
 */
export const HEADER_TORANAM_TILE_COUNT = 3;

/**
 * HEADER_TORANAM_LEFT_PULL_PX
 * -----------------
 * Shifts the entire toranam strip left by this many pixels (negative `left` + wider `width` in TopHeader).
 * Use when the lamp *graphic* does not fill LEFT_LAMP_WIDTH_PX and you still see gold before the first toranam.
 * Left lamp z-index is above the strip, so overlap hides under the lamp. 0 = strip starts at middle-band left edge.
 */
export const HEADER_TORANAM_LEFT_PULL_PX = 47;
