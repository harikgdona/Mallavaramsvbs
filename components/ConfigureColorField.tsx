"use client";

/** Map CSS color (hex, rgb, rgba) to #rrggbb for `<input type="color">`. */
function cssColorToHexForPicker(css: string): string {
  const s = css.trim();
  const m6 = /^#([0-9A-Fa-f]{6})$/i.exec(s);
  if (m6) return `#${m6[1]}`.toUpperCase();
  const m3 = /^#([0-9A-Fa-f]{3})$/i.exec(s);
  if (m3) {
    const [a, b, c] = m3[1].split("");
    return `#${a}${a}${b}${b}${c}${c}`.toUpperCase();
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
  if (rgb) {
    const r = Math.min(255, Math.max(0, Number(rgb[1])));
    const g = Math.min(255, Math.max(0, Number(rgb[2])));
    const b = Math.min(255, Math.max(0, Number(rgb[3])));
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  }
  return "#D4AF37";
}

/** Curated swatches — click applies full CSS value (hex or rgba). */
const PALETTE: { name: string; value: string }[] = [
  { name: "Temple gold", value: "#D4AF37" },
  { name: "Beige", value: "#F5F5DC" },
  { name: "Ivory", value: "#FFFBEB" },
  { name: "Wheat", value: "#F8F1E5" },
  { name: "Sunny yellow", value: "#FDE047" },
  { name: "Deep maroon", value: "#5c1f1f" },
  { name: "Crimson", value: "#7B1E1E" },
  { name: "White", value: "#FFFFFF" },
  { name: "Charcoal", value: "#1e1e1e" },
  { name: "Sage", value: "#9CAF88" },
  { name: "Sky", value: "#87CEEB" },
  { name: "Coral", value: "#E8A598" },
  { name: "Frosted panel", value: "rgba(248, 241, 229, 0.95)" }
];

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

export function ConfigureColorField({ label, value, onChange }: Props) {
  const pickerHex = cssColorToHexForPicker(value);

  return (
    <div className="grid gap-2">
      <span className="text-xs font-medium text-text-dark/70">{label}</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${label} palette`}>
        {PALETTE.map((p) => (
          <button
            key={p.name}
            type="button"
            title={p.name}
            onClick={() => onChange(p.value)}
            className="h-7 w-7 rounded-md border border-maroon/25 shadow-sm shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-maroon/50 ring-offset-1"
            style={{ background: p.value }}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-text-dark/65 cursor-pointer shrink-0">
          <span className="sr-only">Pick {label}</span>
          <input
            type="color"
            value={pickerHex}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded-lg border border-maroon/25 bg-white p-0.5"
          />
          Custom
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#hex or rgba(...)"
          className="min-w-[10rem] flex-1 rounded-xl border border-maroon/20 px-3 py-2 text-sm bg-sandal/40 font-mono"
        />
      </div>
    </div>
  );
}
