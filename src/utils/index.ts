import { Buffer } from "buffer";
import { ELevel } from "../contracts/course.d";

export function toBase64(input: string) {
  return Buffer.from(input, "utf-8").toString("base64");
}

export function fromBase64(encoded: string) {
  return Buffer.from(encoded, "base64").toString("utf8");
}

export const splitStringIntoTwoHalves = (inputString: string) => {
  const length = inputString.length;
  const midpoint = Math.floor(length / 2);
  const firstHalf = inputString.slice(0, midpoint);
  const secondHalf = inputString.slice(midpoint);
  return [firstHalf, secondHalf];
};

export const convertLevelStringToNumber = (level: ELevel) => {
  switch (level) {
    case ELevel.HUNDRED:
      return "100";
    case ELevel.TWOHUNDRED:
      return "200";
    case ELevel.THREEHUNDRED:
      return "300";
    case ELevel.FOURHUNDRED:
      return "400";
    case ELevel.FIVEHUNDRED:
      return "500";
  }
};

export const extractStudentId = (url: string): number | null => {
  const match = url.match(/\/(\d+);?$/);
  return match ? parseInt(match[1], 10) : null;
};


/**
 * Human-readable class label used across filters and cards. Mirrors
 * getClassDisplayName in the admin web (src/lib/class-utils.ts):
 *   - Appends the section letter directly to the class name (JSS1 + A -> JSS1A)
 *   - Appends the faculty in parentheses when present and the class is
 *     NOT a Junior class (faculty streams like Arts/Science/Commercial
 *     only apply to Senior classes; Junior classes get classGroup instead)
 */
export function getClassDisplayName(
  c?: {
    name?: string;
    section?: { name?: string } | null;
    faculty?: { name?: string } | null;
    classGroup?: { name?: string } | null;
  } | null,
): string {
  if (!c) return "";
  let displayName = c.name || "";
  if (c.section?.name) {
    const sectionName = c.section.name.replace(/^Section\s*/i, "");
    displayName = `${displayName}${sectionName}`;
  }
  const group = c.classGroup?.name || "";
  const isJunior = /junior|primary|nursery|kg|prep/i.test(group);
  if (!isJunior && c.faculty?.name) {
    displayName = `${displayName} (${c.faculty.name})`;
  } else if (group) {
    displayName = `${displayName} (${group})`;
  }
  return displayName || "Class";
}

/**
 * Returns the correct "category" label for a student:
 *   - Junior group -> classGroup name (e.g. "Junior")
 *   - Senior group -> faculty name (e.g. "Science"), falling back to classGroup
 *
 * Prevents "Arts / Commercial / Science" from being displayed for JSS
 * students, which was happening when we fell back to the student's own
 * `faculty` relation without accounting for class group.
 */
export function getStudentFacultyLabel(student?: any): string {
  if (!student) return "";
  const klass = student.currentClass || student.class || null;
  const group = klass?.classGroup?.name || "";
  const isJunior = /junior|primary|nursery|kg|prep/i.test(group);
  if (isJunior) return group || "Junior";
  const facultyName = klass?.faculty?.name || student?.faculty?.name || "";
  if (facultyName) return facultyName;
  return group || "";
}

/**
 * Normalize a list-shaped API response into a plain array.
 * Handles: [], { data: [] }, { data: { data: [] } }, null/undefined.
 */
export function asArray<T = any>(input: any): T[] {
  if (Array.isArray(input)) return input as T[];
  if (input && Array.isArray(input.data)) return input.data as T[];
  if (input?.data && Array.isArray(input.data?.data)) return input.data.data as T[];
  return [];
}

export function extractLastNumber(input: string): number | null {
  const matches = input.match(/\d+/g); // Match all number sequences
  if (!matches || matches.length === 0) return null;

  const lastNumber = matches[matches.length - 1];
  return parseInt(lastNumber, 10);
}