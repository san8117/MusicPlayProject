const NAME_PARTICLES = new Set(["da", "das", "de", "do", "dos", "e"]);

/**
 * Trims, normalizes whitespace, and capitalizes a Portuguese full name.
 *
 * @param {string} raw Raw name.
 * @returns {string} Normalized name.
 */
export function formatName(raw) {
  if (typeof raw !== "string") {
    return "";
  }

  const words = raw.trim().replace(/\s+/gu, " ").toLocaleLowerCase("pt-BR");

  if (!words) {
    return "";
  }

  return words
    .split(" ")
    .map((word, index) => word
      .split("-")
      .map((part, partIndex) => {
        if ((index > 0 || partIndex > 0) && NAME_PARTICLES.has(part)) {
          return part;
        }

        const [firstLetter, ...remainingLetters] = Array.from(part);
        return `${firstLetter?.toLocaleUpperCase("pt-BR") ?? ""}${remainingLetters.join("")}`;
      })
      .join("-"))
    .join(" ");
}

/**
 * Returns the first word of a full name.
 *
 * @param {string} fullName Full name.
 * @returns {string} First name, or an empty string.
 */
export function getFirstName(fullName) {
  return formatName(fullName).split(" ")[0] ?? "";
}

/**
 * Returns the first Unicode character of a full name.
 *
 * @param {string} fullName Full name.
 * @returns {string} Initial, or an empty string.
 */
export function getInitial(fullName) {
  return Array.from(getFirstName(fullName))[0] ?? "";
}

/**
 * Trims an email address and converts it to lowercase.
 *
 * @param {string} email Email address.
 * @returns {string} Normalized email.
 */
export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLocaleLowerCase("en-US") : "";
}

/**
 * Formats today's local date without converting it to UTC.
 *
 * @param {Date} [date] Date to format, defaulting to now.
 * @returns {string} Local date in YYYY-MM-DD format.
 */
export function todayKey(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Restricts a finite number to an inclusive range.
 *
 * @param {number} value Input number.
 * @param {number} min Minimum bound.
 * @param {number} max Maximum bound.
 * @returns {number} Clamped number, or min for a non-finite value.
 */
export function clamp(value, min, max) {
  if (![value, min, max].every(Number.isFinite) || min > max) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a percentage in the inclusive range from 0 to 100.
 *
 * @param {number} value Current value.
 * @param {number} total Total value.
 * @returns {number} Percentage, or zero when total is not positive.
 */
export function percent(value, total) {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) {
    return 0;
  }

  return clamp((value / total) * 100, 0, 100);
}

/**
 * Returns a non-negative finite number, falling back to zero.
 *
 * @param {unknown} value Candidate numeric value.
 * @returns {number} Safe non-negative number.
 */
export function toNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
}
