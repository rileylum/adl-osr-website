import { describe, it, expect } from 'vitest';
import {
  events,
  currentEvent,
  currentEventFor,
  pastEvents,
  upcomingEvents,
  assertOneCurrentPerRegion,
  type Event,
} from './events';

/** Minimal Event fixture — only the fields the selectors read matter here. */
function makeEvent(over: Partial<Event>): Event {
  return {
    region: 'Adelaide',
    date: '2026-02-07',
    utcOffset: '+10:30',
    status: 'current',
    venue: {
      name: 'Venue',
      schemaName: 'Venue Inc',
      address: {
        street: '1 St',
        suburb: 'Suburb',
        region: 'SA',
        postcode: '5000',
        country: 'AU',
      },
      schemaLocality: 'Suburb',
      geo: { lat: 0, lng: 0 },
      mapEmbedUrl: 'https://maps',
      phone: '000',
    },
    price: { amount: '15', currency: 'AUD' },
    warhornUrl: 'https://warhorn.net/events/x',
    ...over,
  };
}

describe('currentEvent', () => {
  it('resolves the Adelaide Feb 2026 event', () => {
    expect(currentEvent.region).toBe('Adelaide');
    expect(currentEvent.date).toBe('2026-02-07');
    expect(currentEvent.status).toBe('current');
  });

  it('is the current event returned by the seeded events list', () => {
    expect(currentEvent).toBe(events.find((e) => e.status === 'current'));
  });
});

describe('currentEventFor', () => {
  it('returns the sole current event for a region', () => {
    const adl = makeEvent({ region: 'Adelaide', status: 'current' });
    const mel = makeEvent({ region: 'Melbourne', status: 'current' });
    const all = [adl, mel];
    expect(currentEventFor('Adelaide', all)).toBe(adl);
    expect(currentEventFor('Melbourne', all)).toBe(mel);
  });

  it('ignores non-current events in the same region', () => {
    const past = makeEvent({ region: 'Adelaide', status: 'past' });
    const current = makeEvent({ region: 'Adelaide', status: 'current' });
    expect(currentEventFor('Adelaide', [past, current])).toBe(current);
  });

  it('throws when a region has no current event', () => {
    const upcoming = makeEvent({ region: 'Melbourne', status: 'upcoming' });
    expect(() => currentEventFor('Melbourne', [upcoming])).toThrow(
      /no current event/i
    );
  });
});

describe('pastEvents / upcomingEvents', () => {
  const all = [
    makeEvent({ region: 'Adelaide', status: 'current' }),
    makeEvent({ region: 'Adelaide', status: 'past' }),
    makeEvent({ region: 'Melbourne', status: 'past' }),
    makeEvent({ region: 'Melbourne', status: 'upcoming' }),
  ];

  it('pastEvents returns only archived events', () => {
    const result = pastEvents(all);
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.status === 'past')).toBe(true);
  });

  it('upcomingEvents returns only prefilled future events', () => {
    const result = upcomingEvents(all);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('upcoming');
  });

  it('the seeded list has no past or upcoming events yet', () => {
    expect(pastEvents()).toEqual([]);
    expect(upcomingEvents()).toEqual([]);
  });
});

describe('assertOneCurrentPerRegion (build guard)', () => {
  it('passes when each region has at most one current event', () => {
    const all = [
      makeEvent({ region: 'Adelaide', status: 'current' }),
      makeEvent({ region: 'Adelaide', status: 'past' }),
      makeEvent({ region: 'Melbourne', status: 'current' }),
    ];
    expect(() => assertOneCurrentPerRegion(all)).not.toThrow();
  });

  it('passes on the real seeded events', () => {
    expect(() => assertOneCurrentPerRegion(events)).not.toThrow();
  });

  it('throws when a region has two current events', () => {
    const all = [
      makeEvent({ region: 'Adelaide', status: 'current' }),
      makeEvent({ region: 'Adelaide', status: 'current' }),
    ];
    expect(() => assertOneCurrentPerRegion(all)).toThrow(
      /more than one current event for region "Adelaide"/i
    );
  });

  it('allows the same status count across different regions', () => {
    const all = [
      makeEvent({ region: 'Adelaide', status: 'current' }),
      makeEvent({ region: 'Melbourne', status: 'current' }),
    ];
    expect(() => assertOneCurrentPerRegion(all)).not.toThrow();
  });
});
