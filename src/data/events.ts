// Events module — the single owner of every per-occurrence fact about an OZ ORC
// convention. Each Event owns the facts that vary per region + date: date, UTC
// offset, status, venue, ticket price, Warhorn event URL, its agenda, and its
// games (by reference). Consumers (EventSchema, SEO, Location, Hero, Navbar,
// About, FAQ, Schedule, ...) read the sole `currentEvent` so each fact is typed
// exactly once. See docs/agent/CONTEXT.md (Event, Region, status, currentEvent,
// Venue, Agenda, Session).

import type { Address } from '../lib/format';
import { iso } from '../lib/format';
import { adelaide2026Games, adelaideSep2026Games, type Game } from './games';

/** The geographic scope of an event. At most one `current` event per region
 *  (enforced by the build guard below). Adding a region is additive. */
export type Region = 'Adelaide' | 'Melbourne';

/** Lifecycle of an event. Set deliberately (not date-derived) so a year of
 *  `upcoming` events can be prefilled and archiving is an explicit flip. */
export type EventStatus = 'past' | 'current' | 'upcoming';

/** A ticket price, stored as amount + currency so both the display form
 *  (`$15 AUD`) and the JSON-LD Offer (`price`/`priceCurrency`) derive from one
 *  record. */
export interface Price {
  amount: string;
  currency: string;
}

/** The event's location, stored structured. Every display and schema form is
 *  derived from these fields — see the note on address reconciliation. */
export interface Venue {
  /** Short display name, e.g. "Colonel Light Gardens RSL". */
  name: string;
  /** Legal name used in JSON-LD `Place.name` — genuinely differs from `name`. */
  schemaName: string;
  /** Structured address whose `suburb` carries the display-faithful locality
   *  ("Colonel Light Gardens Adelaide"); `address()` derives the one-line form. */
  address: Address;
  /** JSON-LD `PostalAddress.addressLocality` — the plain locality without the
   *  trailing city ("Colonel Light Gardens"). Distinct from `address.suburb`
   *  because the display line appends "Adelaide" but the schema must not. */
  schemaLocality: string;
  /** Coordinates — the single source for SEO geo tags and JSON-LD `geo`. */
  geo: { lat: number; lng: number };
  /** Google Maps embed URL for the Location page iframe. */
  mapEmbedUrl: string;
  /** Venue contact phone, as displayed. */
  phone: string;
}

/** One row of the event's timetable. Times are canonical `"HH:MM"` 24-hour
 *  strings — every displayed form (military table, friendly heading, ISO
 *  schema) derives from these, so no time is ever typed twice. A row with a
 *  `sessionNumber` is a game-bearing **session**; others are Setup/Lunch/etc.
 *  `end` is omitted for an open-ended row (e.g. an After Party that runs until
 *  close). */
export interface AgendaRow {
  label: string;
  start: string;
  end?: string;
  sessionNumber?: number;
}

/** A session's games plus its canonical times, derived from the agenda. Drives
 *  the schedule's session sections. */
export interface SessionGroup {
  sessionNumber: number;
  start: string;
  end: string;
  games: Game[];
}

export interface Event {
  region: Region;
  /** ISO date (`YYYY-MM-DD`) of the occurrence. */
  date: string;
  /** UTC offset for the region, e.g. `"+10:30"` (Adelaide). */
  utcOffset: string;
  status: EventStatus;
  venue: Venue;
  price: Price;
  /** Base Warhorn event URL — the navbar, hero, about, and FAQ links build on
   *  this, and each game's per-session URL extends it. */
  warhornUrl: string;
  /** Facebook Event URL for this occurrence, if one exists — a funnel while
   *  registration builds. Optional; not every event has one. */
  facebookEventUrl?: string;
  /** The ordered timetable — the single source for both the schedule table and
   *  the session section headings. Any number of rows/sessions is supported. */
  agenda: AgendaRow[];
  /** The event's games, held by reference from the games module. */
  games: Game[];
}

// The venue is shared across both Adelaide events, so it is defined once and
// referenced by each — no fact typed twice, even across occurrences.
const colonelLightGardens: Venue = {
  name: 'Colonel Light Gardens RSL',
  schemaName: 'RSL Colonel Light Gardens Sub Branch Inc',
  address: {
    street: '4 Prince George Parade',
    suburb: 'Colonel Light Gardens Adelaide',
    region: 'SA',
    postcode: '5041',
    country: 'AU',
  },
  schemaLocality: 'Colonel Light Gardens',
  geo: { lat: -34.98605, lng: 138.597715 },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.8249211805587!2d138.59771519999998!3d-34.9860499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0cfd4be116b63%3A0x41af81ff8aee1a85!2sRSL%20Colonel%20Light%20Gardens%20Sub%20Branch%20Inc!5e0!3m2!1sen!2sau!4v1760871343157!5m2!1sen!2sau',
  phone: '(08) 8276 9080',
};

// Adelaide Feb 2026 — archived. Retains its games so the past event stays whole.
const adelaide2026: Event = {
  region: 'Adelaide',
  date: '2026-02-07',
  utcOffset: '+10:30',
  status: 'past',
  venue: colonelLightGardens,
  price: { amount: '15', currency: 'AUD' },
  warhornUrl: 'https://warhorn.net/events/oz-orc-adelaide-feb-2026',
  agenda: [
    { label: 'Setup', start: '08:00', end: '09:00' },
    { label: 'Meet and Greet, Welcome', start: '09:00', end: '09:30' },
    {
      label: 'Games Session 1',
      start: '09:30',
      end: '12:30',
      sessionNumber: 1,
    },
    { label: 'Lunch', start: '12:30', end: '14:00' },
    {
      label: 'Games Session 2',
      start: '14:00',
      end: '17:00',
      sessionNumber: 2,
    },
    { label: 'Dinner', start: '17:00', end: '18:30' },
    {
      label: 'Games Session 3',
      start: '18:30',
      end: '21:30',
      sessionNumber: 3,
    },
    { label: 'Close and Pack Up', start: '21:30', end: '22:00' },
    { label: 'After Party', start: '22:00' },
  ],
  games: adelaide2026Games,
};

// Adelaide Sep 2026 — the current event, now live with its confirmed games
// and Warhorn registration.
const adelaideSep2026: Event = {
  region: 'Adelaide',
  date: '2026-09-12',
  // September is ACST (standard time) — a full hour off Feb's +10:30 ACDT.
  utcOffset: '+09:30',
  status: 'current',
  venue: colonelLightGardens,
  price: { amount: '15', currency: 'AUD' },
  warhornUrl: 'https://warhorn.net/events/ozorc-adelaide-september-2026',
  facebookEventUrl: 'https://www.facebook.com/share/1HQ8CNDTai/',
  agenda: [
    { label: 'Doors Open', start: '08:30', end: '09:00' },
    {
      label: 'Games Session 1',
      start: '09:00',
      end: '12:00',
      sessionNumber: 1,
    },
    { label: 'Lunch', start: '12:00', end: '13:00' },
    {
      label: 'Games Session 2',
      start: '13:00',
      end: '16:00',
      sessionNumber: 2,
    },
    { label: 'Dinner', start: '16:00', end: '17:00' },
    {
      label: 'Games Session 3',
      start: '17:00',
      end: '20:00',
      sessionNumber: 3,
    },
    { label: 'Close and Pack Up', start: '20:00', end: '20:30' },
  ],
  games: adelaideSep2026Games,
};

export const events: Event[] = [adelaide2026, adelaideSep2026];

/** Throws if any region has more than one `current` event. Exported and pure so
 *  it can be unit-tested against a fixture; called at module load below as the
 *  build-time guard over the real `events`. */
export function assertOneCurrentPerRegion(all: Event[]): void {
  const seen = new Set<Region>();
  for (const event of all) {
    if (event.status !== 'current') continue;
    if (seen.has(event.region)) {
      throw new Error(
        `More than one current event for region "${event.region}" — exactly one is allowed.`
      );
    }
    seen.add(event.region);
  }
}

/** Throws if any game references a `session` number that its event's agenda
 *  does not define. Because `Game.session` is an unconstrained `number` (so an
 *  event is not fixed to three sessions), a typo like `session: 5` would
 *  otherwise compile cleanly and the game would silently vanish from the
 *  schedule — no section groups it. This turns that into a build failure.
 *  Exported and pure so it can be unit-tested against a fixture. */
export function assertGamesMatchSessions(all: Event[]): void {
  for (const event of all) {
    const defined = new Set(
      event.agenda
        .map((row) => row.sessionNumber)
        .filter((n): n is number => n !== undefined)
    );
    for (const game of event.games) {
      if (!defined.has(game.session)) {
        throw new Error(
          `Game "${game.title}" (${event.region}) has session ${game.session}, which no agenda row defines.`
        );
      }
    }
  }
}

// Build-time guards: a duplicate `current`, or a game pointing at a session the
// agenda does not define, fails the build instead of shipping.
assertOneCurrentPerRegion(events);
assertGamesMatchSessions(events);

/** The sole `current` event for a region. Throws if none is set. */
export function currentEventFor(region: Region, all: Event[] = events): Event {
  const match = all.find(
    (event) => event.region === region && event.status === 'current'
  );
  if (!match) {
    throw new Error(`No current event for region "${region}".`);
  }
  return match;
}

/** All archived events. */
export function pastEvents(all: Event[] = events): Event[] {
  return all.filter((event) => event.status === 'past');
}

/** All prefilled, not-yet-featured events. */
export function upcomingEvents(all: Event[] = events): Event[] {
  return all.filter((event) => event.status === 'upcoming');
}

/** The single featured event while OZ ORC runs one region. Nearly every
 *  consumer reads its facts through this. */
export const currentEvent: Event = currentEventFor('Adelaide');

/** Group games by the agenda's session rows, in agenda order. Pure over an
 *  `agenda` + `games` set so it is unit-tested independently of any Event.
 *  Throws if a game-bearing session row has no `end` — a session must have a
 *  full time range. */
export function sessionGroups(
  agenda: AgendaRow[],
  games: Game[]
): SessionGroup[] {
  const groups: SessionGroup[] = [];
  for (const row of agenda) {
    if (row.sessionNumber === undefined) continue;
    if (row.end === undefined) {
      throw new Error(
        `Session ${row.sessionNumber} ("${row.label}") has no end time.`
      );
    }
    groups.push({
      sessionNumber: row.sessionNumber,
      start: row.start,
      end: row.end,
      games: games.filter((game) => game.session === row.sessionNumber),
    });
  }
  return groups;
}

/** schema.org `startDate` — the first game-bearing **session** row's start, as
 *  ISO+offset. Deriving from sessions (not the literal first agenda row) keeps
 *  internal rows like Setup / Doors out of the public window search engines and
 *  calendars advertise. Falls back to the first agenda row if an event defines
 *  no sessions. */
export function eventStart(
  event: Pick<Event, 'date' | 'utcOffset' | 'agenda'>
): string {
  const sessions = event.agenda.filter(
    (row) => row.sessionNumber !== undefined
  );
  const first = sessions[0] ?? event.agenda[0];
  return iso(event.date, first.start, event.utcOffset);
}

/** schema.org `endDate` — the last **session** row's end (its start if
 *  open-ended), as ISO+offset. Deriving from sessions excludes trailing rows
 *  like Pack Up / After Party from the public window. Falls back to the last
 *  agenda row if an event defines no sessions. */
export function eventEnd(
  event: Pick<Event, 'date' | 'utcOffset' | 'agenda'>
): string {
  const sessions = event.agenda.filter(
    (row) => row.sessionNumber !== undefined
  );
  const last =
    sessions[sessions.length - 1] ?? event.agenda[event.agenda.length - 1];
  return iso(event.date, last.end ?? last.start, event.utcOffset);
}
