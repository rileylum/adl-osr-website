// Events module — the single owner of every per-occurrence fact about an OZ ORC
// convention. Each Event owns the facts that vary per region + date: date, UTC
// offset, status, venue, ticket price, and Warhorn event URL. Consumers
// (EventSchema, SEO, Location, Hero, Navbar, About, FAQ, ...) read the sole
// `currentEvent` so each fact is typed exactly once. See docs/agent/CONTEXT.md
// (Event, Region, status, currentEvent, Venue).
//
// Agenda/session modelling and games-by-reference are deferred to issue 0004;
// this module carries the event's scalar and venue facts only.

import type { Address } from '../lib/format';

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
}

const adelaide2026: Event = {
  region: 'Adelaide',
  date: '2026-02-07',
  utcOffset: '+10:30',
  status: 'current',
  venue: {
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
  },
  price: { amount: '15', currency: 'AUD' },
  warhornUrl: 'https://warhorn.net/events/oz-orc-adelaide-feb-2026',
};

export const events: Event[] = [adelaide2026];

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

// Build-time guard: a duplicate `current` fails the build instead of shipping.
assertOneCurrentPerRegion(events);

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
