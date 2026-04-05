"use client";

import { useTranslate } from "./ConfigProvider";
import { useSectionTabs } from "./SectionTabs";

type Props = {
  size?: "default" | "large";
};

export function DonationButton({ size = "default" }: Props) {
  const t = useTranslate();
  const { setActiveSection } = useSectionTabs();
  const label = t("donate_now");

  const padding = size === "large" ? "px-8 py-3.5 text-base" : "";

  return (
    <button
      type="button"
      onClick={() => setActiveSection("donate")}
      className={`btn-primary ${padding}`}
    >
      {label}
    </button>
  );
}
