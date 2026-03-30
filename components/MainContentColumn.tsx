"use client";

import { useSiteManual } from "@/components/ConfigProvider";

export function MainContentColumn({ children }: { children: React.ReactNode }) {
  const { siteManual } = useSiteManual();
  return (
    <div
      className="relative flex min-h-0 min-w-0 flex-1 flex-col"
      style={{ backgroundColor: siteManual.siteMainColumnBackground }}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
