"use client";

import type { TypographyFontPreset } from "@/lib/typographyFontPresets";
import { familyCssMatchesPreset } from "@/lib/typographyFontPresets";

const SAMPLE = "Mallavaram — AaBb 123";

type Props = {
  title: string;
  presets: readonly TypographyFontPreset[];
  value: string;
  onSelect: (familyCss: string) => void;
  /** Larger preview sample for headings */
  variant: "body" | "heading";
};

export function ConfigureFontPresetPicker({ title, presets, value, onSelect, variant }: Props) {
  const sampleClass = variant === "heading" ? "text-lg md:text-xl leading-snug" : "text-sm leading-snug";

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold text-maroon">{title}</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {presets.map((p) => {
          const selected = familyCssMatchesPreset(value, p.familyCss);
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onSelect(p.familyCss)}
              className={`rounded-xl border px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/40 ${
                selected
                  ? "border-maroon bg-maroon/5 shadow-sm ring-2 ring-maroon/25"
                  : "border-maroon/20 bg-white hover:border-maroon/35 hover:bg-sandal/30"
              }`}
            >
              <span className="block text-[0.65rem] font-medium uppercase tracking-wide text-text-dark/55">
                {p.label}
              </span>
              <span
                className={`mt-1 block text-maroon ${sampleClass}`}
                style={{ fontFamily: p.familyCss }}
              >
                {SAMPLE}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
