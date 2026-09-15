import { describe, it, expect } from 'vitest';
import {
  events,
  currentEvent,
  currentEventFor,
  latestEvent,
  latestEventFor,
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

describe('currentEvent / latestEvent', () => {
  it('is undefined in the off-season after Sep 2026', () => {
    expect(currentEvent).toBeUndefined();
  });

  it('latestEvent falls back to the archived Sep 2026 event with its games', () => {
    expect(latestEvent.date).toBe('2026-09-12');
    expect(latestEvent.status).toBe('past');
    // September is standard time — a full hour off Feb's +10:30.
    expect(latestEvent.utcOffset).toBe('+09:30');
    expect(latestEvent.games).toHaveLength(17);
  });
});

describe('latestEventFor', () => {
  it('prefers the current event over a later-dated past one', () => {
    const current = makeEvent({ date: '2026-01-01', status: 'current' });
    const past = makeEvent({ date: '2026-06-01', status: 'past' });
    expect(latestEventFor('Adelaide', [past, current])).toBe(current);
  });

  it('returns the most recent past event in the region when none is current', () => {
    const older = makeEvent({ date: '2026-02-07', status: 'past' });
    const newer = makeEvent({ date: '2026-09-12', status: 'past' });
    const otherRegion = makeEvent({
      region: 'Melbourne',
      date: '2027-01-01',
      status: 'past',
    });
    expect(latestEventFor('Adelaide', [newer, otherRegion, older])).toBe(newer);
  });

  it('ignores upcoming events and returns undefined when nothing qualifies', () => {
    const upcoming = makeEvent({ status: 'upcoming' });
    expect(latestEventFor('Adelaide', [upcoming])).toBeUndefined();
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

  it('returns undefined when a region has no current event', () => {
    const upcoming = makeEvent({ region: 'Melbourne', status: 'upcoming' });
    expect(currentEventFor('Melbourne', [upcoming])).toBeUndefined();
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

  it('the seeded list has two archived events (Feb + Sep 2026) and none upcoming', () => {
    const past = pastEvents();
    expect(past.map((e) => e.date)).toEqual(['2026-02-07', '2026-09-12']);
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
    const groups = sessionGroups(latestEvent.agenda, latestEvent.games);
    expect(groups.map((g) => g.sessionNumber)).toEqual([1, 2, 3]);
    expect(groups.flatMap((g) => g.games)).toHaveLength(
      latestEvent.games.length
    );
  });
});

describe('eventStart / eventEnd', () => {
  // Non-session rows (Setup, After Party) bracket the sessions; the public
  // schema window must derive from the first/last SESSION rows, not these.
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
      {
        label: 'Games Session 2',
        start: '14:00',
        end: '17:00',
        sessionNumber: 2,
      },
      { label: 'After Party', start: '22:00' },
    ],
  });

  it('derives startDate from the first session row, not the Setup row', () => {
    expect(eventStart(event)).toBe('2026-02-07T09:30:00+10:30');
  });

  it('derives endDate from the last session row, not the After Party row', () => {
    expect(eventEnd(event)).toBe('2026-02-07T17:00:00+10:30');
  });

  it('falls back to the literal first/last rows when an event has no sessions', () => {
    const noSessions = makeEvent({
      date: '2026-02-07',
      utcOffset: '+10:30',
      agenda: [
        { label: 'Doors', start: '09:00', end: '10:00' },
        { label: 'Talk', start: '10:00', end: '11:00' },
      ],
    });
    expect(eventStart(noSessions)).toBe('2026-02-07T09:00:00+10:30');
    expect(eventEnd(noSessions)).toBe('2026-02-07T11:00:00+10:30');
  });

  it('uses the last row’s start when a no-session event ends open-ended', () => {
    const openEnded = makeEvent({
      date: '2026-02-07',
      utcOffset: '+10:30',
      agenda: [
        { label: 'Doors', start: '09:00', end: '10:00' },
        { label: 'Mingle', start: '10:00' },
      ],
    });
    expect(eventEnd(openEnded)).toBe('2026-02-07T10:00:00+10:30');
  });
});
