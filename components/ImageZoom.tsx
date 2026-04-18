"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageZoom({
  src,
  alt,
  fill,
  sizes,
  className,
  unoptimized,
  onClick
}: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  unoptimized?: boolean;
  onClick?: () => void;
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <div
        className={`${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={() => setIsZoomed(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsZoomed(true);
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className="object-contain"
          unoptimized={unoptimized}
        />
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-51"
            aria-label="Close zoom"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative w-full h-full max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              unoptimized={unoptimized}
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
