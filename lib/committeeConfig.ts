export const COMMITTEE_STORAGE_KEY = "mallavaram-committee-config";

/** Max members (localStorage); keep reasonable for uploads */
export const MAX_COMMITTEE_MEMBERS = 24;

export type CommitteeMemberConfig = {
  src: string;
  nameEn: string;
  nameTe: string;
  designationEn: string;
  designationTe: string;
};

export function defaultCommitteeMembers(): CommitteeMemberConfig[] {
  return [];
}

export function normalizeCommitteeMembers(raw: unknown): CommitteeMemberConfig[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_COMMITTEE_MEMBERS).map((row) => {
    const o = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
    const legacyName = typeof o.name === "string" ? o.name : "";
    const legacyDesig = typeof o.designation === "string" ? o.designation : "";
    return {
      src: typeof o.src === "string" ? o.src : "",
      nameEn: typeof o.nameEn === "string" ? o.nameEn : legacyName,
      nameTe: typeof o.nameTe === "string" ? o.nameTe : "",
      designationEn: typeof o.designationEn === "string" ? o.designationEn : legacyDesig,
      designationTe: typeof o.designationTe === "string" ? o.designationTe : ""
    };
  });
}
