// lib/date-utils.ts

export type DateParts = {
  month: number;
  day: number;
  year: number;
};

export function isLeapYear(year: number): boolean {
  if (!Number.isInteger(year)) return false;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(month: number, year: number): number {
  if (month < 1 || month > 12) return 0;
  const thirtyOne = new Set([1, 3, 5, 7, 8, 10, 12]);
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return thirtyOne.has(month) ? 31 : 30;
}

/**
 * Parse MM/DD/YYYY when fully entered (10 chars with slashes)
 */
export function parseMMDDYYYY(text: string): DateParts | null {
  if (typeof text !== "string") return null;
  const m = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m || !m[1] || !m[2] || !m[3]) return null;
  const month = Number.parseInt(m[1], 10);
  const day = Number.parseInt(m[2], 10);
  const year = Number.parseInt(m[3], 10);
  return {month, day, year};
}

/**
 * Returns true if parts represent a valid calendar date.
 * Optionally enforce min/max ISO (YYYY-MM-DD).
 */
export function isValidDate(
  parts: DateParts,
  opts?: {minISO?: string; maxISO?: string},
): boolean {
  const {month, day, year} = parts;
  if (!Number.isInteger(year) || year < 100 || year > 9999) return false;
  if (!Number.isInteger(month) || month < 1 || month > 12) return false;
  const dim = daysInMonth(month, year);
  if (!Number.isInteger(day) || day < 1 || day > dim) return false;

  // Optional range checks
  if (opts?.minISO || opts?.maxISO) {
    const iso = toISO(parts);
    if (opts.minISO && iso < opts.minISO) return false;
    if (opts.maxISO && iso > opts.maxISO) return false;
  }
  return true;
}

export function toISO(parts: DateParts): string {
  const mm = String(parts.month).padStart(2, "0");
  const dd = String(parts.day).padStart(2, "0");
  const yyyy = String(parts.year).padStart(4, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Convert ISO YYYY-MM-DD to MM/DD/YYYY text format
 */
export function fromISOToText(iso?: string | null): string {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const yyyy = m[1];
  const mm = m[2];
  const dd = m[3];
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * Formats a string of digits to "MM/DD/YYYY" progressively as user types.
 * Only keeps up to 8 digits.
 */
export function maskDigitsToMMDDYYYY(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/**
 * Given text "MM/DD/YYYY", return { parts, iso, valid }
 */
export function validateTextDateMMDDYYYY(
  text: string,
  opts?: {minISO?: string; maxISO?: string},
): {valid: boolean; iso: string | null; parts: DateParts | null} {
  const parts = parseMMDDYYYY(text);
  if (!parts) return {valid: false, iso: null, parts: null};
  const valid = isValidDate(parts, opts);
  return {
    valid,
    iso: valid ? toISO(parts) : null,
    parts: valid ? parts : null,
  };
}
