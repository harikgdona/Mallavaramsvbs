"use client";

import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="flex items-center rounded-full bg-sandal/60 border border-maroon/20 text-xs md:text-sm overflow-hidden"
      aria-label="Language toggle"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 md:px-4 md:py-2 ${
          language === "en"
            ? "bg-maroon text-white"
            : "text-text-dark hover:bg-sandal"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("te")}
        className={`px-3 py-1.5 md:px-4 md:py-2 ${
          language === "te"
            ? "bg-maroon text-white"
            : "text-text-dark hover:bg-sandal"
        }`}
      >
        TE
      </button>
    </div>
  );
}

