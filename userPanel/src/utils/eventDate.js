const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const shortMonths = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'
];

/**
 * Parses any date string (including multi-day ranges like "FEB 12 – 16, 2026",
 * "SATURDAY MAY 23, 2026", "August 1, 2026", "2026-09-19")
 * and returns the Date object representing the final/closing day of the event (00:00:00 UTC).
 */
export function parseEventEndDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const str = dateStr.trim();

  // Try ISO format (e.g. YYYY-MM-DD or YYYY/MM/DD)
  const isoMatch = str.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    return new Date(Date.UTC(y, m, d, 0, 0, 0));
  }

  // Look for 4-digit year (e.g. 2026)
  const yearMatch = str.match(/\b(20\d\d)\b/);
  if (!yearMatch) return null;
  const year = parseInt(yearMatch[1], 10);

  // Look for month
  let monthIndex = -1;
  const words = str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/);
  for (const w of words) {
    const fullIdx = months.indexOf(w);
    if (fullIdx !== -1) {
      monthIndex = fullIdx;
      break;
    }
    const shortIdx = shortMonths.indexOf(w);
    if (shortIdx !== -1) {
      monthIndex = shortIdx === 9 ? 8 : (shortIdx > 9 ? shortIdx - 1 : shortIdx);
      break;
    }
  }

  if (monthIndex === -1) {
    const parsed = Date.parse(str);
    if (!isNaN(parsed)) {
      const d = new Date(parsed);
      return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0));
    }
    return null;
  }

  const numbers = (str.match(/\b\d{1,2}\b/g) || []).map(Number).filter(n => n >= 1 && n <= 31);
  if (numbers.length === 0) return null;

  const endDay = numbers[numbers.length - 1];
  return new Date(Date.UTC(year, monthIndex, endDay, 0, 0, 0));
}

/**
 * Determines whether an event has fully ended in every country on Earth.
 * The latest timezone on Earth is UTC-12 (Baker / Howland Island / AoE - Anywhere on Earth).
 * A calendar day D ends when UTC time reaches 12:00:00 PM of (D + 1 day),
 * which is 36 hours after 00:00:00 UTC of date D.
 */
export function isEventPast(dateStr) {
  const endDate = parseEventEndDate(dateStr);
  if (!endDate) return false;

  const endEverywhereTimestamp = endDate.getTime() + (36 * 60 * 60 * 1000);
  return Date.now() >= endEverywhereTimestamp;
}

/**
 * Sorts an array of events by date in descending order (latest event first).
 */
export function sortEventsByDateDesc(events = []) {
  if (!Array.isArray(events)) return [];
  return [...events].sort((a, b) => {
    const dateA = parseEventEndDate(a.date || a.eventDate);
    const dateB = parseEventEndDate(b.date || b.eventDate);
    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;
    return timeB - timeA;
  });
}
