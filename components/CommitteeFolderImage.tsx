"use client";

import { useCallback, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { COMMITTEE_MEMBER_PHOTOS_PATH } from "@/lib/committeeMemberPhotoStem";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

type Props = {
  stem: string;
  alt: string;
  className?: string;
};

/**
 * Loads the first existing file under `public/images/Committee_members/{stem}.{jpg|jpeg|png|webp}`.
 */
export function CommitteeFolderImage({ stem, alt, className }: Props) {
  const [i, setI] = useState(0);
  const [givenUp, setGivenUp] = useState(false);

  const onError = useCallback(() => {
    setI((prev) => {
      if (prev < EXTENSIONS.length - 1) return prev + 1;
      setGivenUp(true);
      return prev;
    });
  }, []);

  if (!stem.trim() || givenUp) {
    return (
      <div
        className={
          className
            ? "absolute inset-0 flex items-center justify-center bg-sky-100/90 text-[10px] font-medium text-maroon/35"
            : "absolute inset-0 flex items-center justify-center bg-sky-100/90 text-xs font-medium text-maroon/35"
        }
        aria-hidden
      >
        Photo
      </div>
    );
  }

  const src = withBasePath(`${COMMITTEE_MEMBER_PHOTOS_PATH}/${stem}${EXTENSIONS[i]}`);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- intentional: try multiple extensions on 404
    <img src={src} alt={alt} className={className ?? "absolute inset-0 h-full w-full object-cover object-top"} onError={onError} />
  );
}
