"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionContainer } from "@/components/SectionContainer";
import { useConfig } from "@/components/ConfigProvider";
import { tMap, CONFIG_SECTIONS } from "@/i18n/config";

type Overrides = Record<string, { en: string; te: string }>;

function getEffective(sectionOverrides: Overrides, key: string): { en: string; te: string } {
  return (
    sectionOverrides[key] ?? {
      en: (tMap as Record<string, { en: string; te: string }>)[key]?.en ?? "",
      te: (tMap as Record<string, { en: string; te: string }>)[key]?.te ?? ""
    }
  );
}

export function ConfigureSection() {
  const { overrides, saveOverrides, resetOverrides } = useConfig();
  const [draft, setDraft] = useState<Overrides>(() => ({ ...overrides }));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft((prev) => ({ ...overrides }));
  }, [overrides]);

  const updateDraft = useCallback((key: string, lang: "en" | "te", value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...getEffective(prev, key),
        [lang]: value
      }
    }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    saveOverrides(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [draft, saveOverrides]);

  const handleReset = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Reset all text to defaults?")) {
      resetOverrides();
      setDraft({});
      setSaved(false);
    }
  }, [resetOverrides]);

  return (
    <SectionContainer id="configure">
      <div className="bg-white rounded-3xl border border-maroon/20 shadow-md p-6 md:p-8">
        <h2 className="section-heading">Configure</h2>
        <p className="section-subtitle mb-6">
          Edit text by section (header name). Changes are saved in this browser only.
        </p>

        <div className="space-y-8">
          {Object.entries(CONFIG_SECTIONS).map(([headerName, keys]) => (
            <fieldset key={headerName} className="border border-maroon/20 rounded-2xl p-4 md:p-5">
              <legend className="font-heading text-lg text-maroon px-2 font-bold">
                {headerName}
              </legend>
              <div className="space-y-4 mt-2">
                {keys.map((key) => {
                  const keyStr = String(key);
                  const val = getEffective(draft, keyStr);
                  return (
                    <div key={keyStr} className="grid gap-2">
                      <label className="text-xs font-medium text-text-dark/70 uppercase tracking-wide">
                        {keyStr}
                      </label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">English</span>
                          <input
                            type="text"
                            value={val.en}
                            onChange={(e) => updateDraft(keyStr, "en", e.target.value)}
                            className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-sandal/40"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-maroon/80 block mb-1">Telugu</span>
                          <input
                            type="text"
                            value={val.te}
                            onChange={(e) => updateDraft(keyStr, "te", e.target.value)}
                            className="w-full rounded-xl border border-maroon/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon bg-sandal/40"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-maroon/10">
          <button type="button" onClick={handleSave} className="btn-primary">
            {saved ? "Saved" : "Save all"}
          </button>
          <button type="button" onClick={handleReset} className="btn-outline">
            Reset to defaults
          </button>
        </div>
      </div>
    </SectionContainer>
  );
}
