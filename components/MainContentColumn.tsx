"use client";

import { useSiteManual } from "@/components/ConfigProvider";

export function MainContentColumn({ children }: { children: React.ReactNode }) {
  const { siteManual } = useSiteManual();
  return (
    <div
      className="flex-1 flex flex-col relative min-w-0"
      style={{ backgroundColor: siteManual.siteMainColumnBackground }}
    >
      {children}
    </div>
  );
}
