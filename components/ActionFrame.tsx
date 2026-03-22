"use client";

import { Great_Vibes } from "next/font/google";
import { DonationButton } from "./DonationButton";
import { WhatsAppButton } from "./WhatsAppButton";
import { LanguageToggle } from "./LanguageToggle";

const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

type Props = {
  className?: string;
  /** Compact vertical spacing when used in sidebar */
  compact?: boolean;
};

export function ActionFrame({ className = "", compact = false }: Props) {
  return (
    <div
      className={`flex flex-col border-t border-maroon/10 bg-header-yellow ${compact ? "p-3 space-y-2" : "p-4 space-y-3"} ${className}`}
    >
      <div className="w-full">
        <LanguageToggle />
      </div>
      <DonationButton />
      <WhatsAppButton inHeader className="w-full" />
      <div className="pt-2 text-center border-t border-maroon/10">
        <p className="text-xs text-text-dark/80 mb-1.5">Built and hosted by</p>
        <p className={`text-2xl ${greatVibes.className} text-maroon`}>
          Hari Krishna
        </p>
      </div>
    </div>
  );
}
