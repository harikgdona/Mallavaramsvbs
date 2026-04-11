import type { CommitteeMemberConfig } from "@/lib/committeeConfig";

/** Public URL folder (files live under `public/images/Committee_members`). */
export const COMMITTEE_MEMBER_PHOTOS_PATH = "/images/Committee_members";

/** Slug for filenames: lowercase, spaces → hyphens, strip characters unsafe in Windows paths. */
export function slugifyDesignationForFilename(designationEn: string): string {
  return designationEn
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * File stem (no extension) for `public/images/Committee_members/<stem>.jpg` etc.
 * Duplicate designations in the same group get `-1`, `-2`, … in list order.
 */
export function getCommitteeMemberPhotoStem(
  member: CommitteeMemberConfig,
  sameGroupOrdered: CommitteeMemberConfig[]
): string {
  const d = (member.designationEn || "").trim() || "member";
  const slug = slugifyDesignationForFilename(d);
  const total = sameGroupOrdered.filter((x) => (x.designationEn || "").trim() === d).length;
  if (total <= 1) return slug;
  let nth = 0;
  for (const x of sameGroupOrdered) {
    if ((x.designationEn || "").trim() !== d) continue;
    nth += 1;
    if (x === member) return `${slug}-${nth}`;
  }
  return `${slug}-1`;
}
