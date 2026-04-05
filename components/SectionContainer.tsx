import React from "react";

type Props = {
  id?: string;
  className?: string;
  /** When true, section is at least one viewport tall (minus header chrome); tweak offsets in globals.css. */
  fillViewport?: boolean;
  children: React.ReactNode;
};

export function SectionContainer({ id, className, fillViewport, children }: Props) {
  return (
    <section
      id={id}
      className={`min-w-0 max-w-full py-4 md:py-6 px-4 sm:px-6 lg:px-8 ${fillViewport ? "min-h-app-section " : ""}${className ?? ""}`}
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">{children}</div>
    </section>
  );
}

