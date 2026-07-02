import { describe, it, expect } from 'vitest';
import {
  events,
  currentEvent,
  currentEventFor,
  pastEvents,
  upcomingEvents,
  assertOneCurrentPerRegion,
  assertGamesMatchSessions,
  sessionGroups,
  eventStart,
  eventEnd,
  type Event,
  type AgendaRow,
} from './events';
import type { Game } from './games';

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
    agenda: [
      {
        label: 'Games Session 1',
        start: '09:30',
        end: '12:30',
        sessionNumber: 1,
      },
    ],
    games: [],
    ...over,
  };
}

/** Minimal Game fixture — only `session` matters for grouping. */
function makeGame(session: number, title: string): Game {
  return {
    title,
    system: 'System',
    image: '/images/games/x.webp',
    description: 'A game.',
    warhornUrl: 'https://warhorn.net/events/x/schedule/sessions/uuid',
    session,
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

describe('assertGamesMatchSessions (build guard)', () => {
  const agenda: AgendaRow[] = [
    { label: 'Setup', start: '08:00', end: '09:00' },
    {
      label: 'Games Session 1',
      start: '09:30',
      end: '12:30',
      sessionNumber: 1,
    },
    {
      label: 'Games Session 2',
      start: '14:00',
      end: '17:00',
      sessionNumber: 2,
    },
  ];

  it('passes when every game maps to an agenda session', () => {
    const all = [
      makeEvent({ agenda, games: [makeGame(1, 'A'), makeGame(2, 'B')] }),
    ];
    expect(() => assertGamesMatchSessions(all)).not.toThrow();
  });

  it('throws when a game points at a session the agenda does not define', () => {
    const all = [
      makeEvent({ agenda, games: [makeGame(1, 'A'), makeGame(5, 'Stray')] }),
    ];
    expect(() => assertGamesMatchSessions(all)).toThrow(
      /"Stray".*session 5, which no agenda row defines/i
    );
  });

  it('checks each event against its own agenda', () => {
    const all = [
      makeEvent({ region: 'Adelaide', agenda, games: [makeGame(1, 'A')] }),
      makeEvent({
        region: 'Melbourne',
        agenda: [
          {
            label: 'Games Session 1',
            start: '10:00',
            end: '13:00',
            sessionNumber: 1,
          },
        ],
        games: [makeGame(2, 'Wrong')],
      }),
    ];
    expect(() => assertGamesMatchSessions(all)).toThrow(
      /Melbourne.*session 2/i
    );
  });

  it('passes on the real seeded events', () => {
    expect(() => assertGamesMatchSessions(events)).not.toThrow();
  });
});

describe('sessionGroups', () => {
  const agenda: AgendaRow[] = [
    { label: 'Setup', start: '08:00', end: '09:00' },
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
  ];
  const games = [
    makeGame(1, 'One-A'),
    makeGame(2, 'Two-A'),
    makeGame(1, 'One-B'),
    makeGame(2, 'Two-B'),
  ];

  it('returns one group per session row, in agenda order', () => {
    const groups = sessionGroups(agenda, games);
    expect(groups.map((g) => g.sessionNumber)).toEqual([1, 2]);
  });

  it('carries each session row’s canonical times', () => {
    const [first] = sessionGroups(agenda, games);
    expect(first.start).toBe('09:30');
    expect(first.end).toBe('12:30');
  });

  it('groups games by their session number', () => {
    const groups = sessionGroups(agenda, games);
    expect(groups[0].games.map((g) => g.title)).toEqual(['One-A', 'One-B']);
    expect(groups[1].games.map((g) => g.title)).toEqual(['Two-A', 'Two-B']);
  });

  it('ignores non-session rows (no sessionNumber)', () => {
    expect(sessionGroups(agenda, games)).toHaveLength(2);
  });

  it('yields an empty games array for a session with no games', () => {
    const groups = sessionGroups(agenda, [makeGame(1, 'Only-One')]);
    expect(groups[1].games).toEqual([]);
  });

  it('throws when a game-bearing session row has no end time', () => {
    const bad: AgendaRow[] = [
      { label: 'Games Session 1', start: '09:30', sessionNumber: 1 },
    ];
    expect(() => sessionGroups(bad, games)).toThrow(/no end time/i);
  });

  it('groups the real seeded event without throwing', () => {
    const groups = sessionGroups(currentEvent.agenda, currentEvent.games);
    expect(groups.map((g) => g.sessionNumber)).toEqual([1, 2, 3]);
    expect(groups.flatMap((g) => g.games)).toHaveLength(
      currentEvent.games.length
    );
  });
});

describe('eventStart / eventEnd', () => {
  const event = makeEvent({
    date: '2026-02-07',
    utcOffset: '+10:30',
    agenda: [
      { label: 'Setup', start: '08:00', end: '09:00' },
      {
        label: 'Games Session 1',
        start: '09:30',
        end: '12:30',
        sessionNumber: 1,
      },
      { label: 'After Party', start: '22:00' },
    ],
  });

  it('derives startDate from the first agenda row', () => {
    expect(eventStart(event)).toBe('2026-02-07T08:00:00+10:30');
  });

  it('derives endDate from the last agenda row, using its start when open-ended', () => {
    expect(eventEnd(event)).toBe('2026-02-07T22:00:00+10:30');
  });

  it('uses the last row’s end when it is present', () => {
    const closed = makeEvent({
      date: '2026-02-07',
      utcOffset: '+10:30',
      agenda: [
        {
          label: 'Games Session 1',
          start: '09:30',
          end: '12:30',
          sessionNumber: 1,
        },
        { label: 'Close and Pack Up', start: '21:30', end: '22:00' },
      ],
    });
    expect(eventEnd(closed)).toBe('2026-02-07T22:00:00+10:30');
  });
});
