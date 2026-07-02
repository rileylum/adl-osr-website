// Pure display formatters. Every displayed form of a time or address is
// derived here from a single canonical value, so no fact is ever typed twice.
// See docs/agent/CONTEXT.md (Time, Venue) for the domain vocabulary.

/** Structured venue address parts. `country` is stored for JSON-LD but is
 *  omitted from the one-line display form. */
export interface Address {
  street: string;
  suburb: string;
  region: string;
  postcode: string;
  country: string;
}

/** Zero-pad a number to two digits. */
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Parse a canonical `"HH:MM"` 24-hour string into its hour and minute.
 *  Tolerates an un-padded hour (`"9:30"`). */
function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':');
  return { hour: Number(h), minute: Number(m) };
}

/** Military / timetable form: `mil("09:30") → "0930"`. */
export function mil(time: string): string {
  const { hour, minute } = parseTime(time);
  return `${pad2(hour)}${pad2(minute)}`;
}

/** Friendly / session-heading form: `friendly("09:30") → "9:30AM"`.
 *  12-hour clock with un-padded hour; midnight is `12:00AM`, noon `12:00PM`. */
export function friendly(time: string): string {
  const { hour, minute } = parseTime(time);
  const period = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${pad2(minute)}${period}`;
}

/** schema.org datetime with UTC offset, composed from an event date, a
 *  canonical time, and the region offset:
 *  `iso("2026-02-07", "09:00", "+10:30") → "2026-02-07T09:00:00+10:30"`. */
export function iso(date: string, time: string, offset: string): string {
  const { hour, minute } = parseTime(time);
  return `${date}T${pad2(hour)}:${pad2(minute)}:00${offset}`;
}

/** Free-text one-line address as shown on the Location page:
 *  `"4 Prince George Parade, Colonel Light Gardens Adelaide, SA, 5041"`.
 *  Country is intentionally omitted from this display form. */
export function address(a: Address): string {
  return [a.street, a.suburb, a.region, a.postcode].filter(Boolean).join(', ');
}
