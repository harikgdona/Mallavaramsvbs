import React from "react";

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionContainer({ id, className, children }: Props) {
  return (
    <section
      id={id}
      className={`py-12 md:py-20 px-4 sm:px-6 lg:px-8 ${className ?? ""}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

