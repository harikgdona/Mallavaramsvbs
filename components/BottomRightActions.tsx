"use client";

import { LanguageToggle } from "./LanguageToggle";

export function BottomRightActions() {
  return (
    <div
      className="fixed bottom-5 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3"
      aria-label="Language toggle"
    >
      <LanguageToggle />
    </div>
  );
}
