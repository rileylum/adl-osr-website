// Homepage funnel — the single owner of the event-state branching behind the
// cover and the command bar. The components only display what this returns,
// so every season can be tested against fixtures and a second homepage look
// can reuse it unchanged.

import type { Event, GmApplications } from './events';
import { longDate } from '../lib/format';

/** The event state the funnel depends on. Passed in rather than imported so
 *  tests can check every season against fixtures. */
export interface FunnelState {
  currentEvent: Event | undefined;
  latestEvent: Event;
  gmApplications: GmApplications | undefined;
  /** events.ts nextEventWindow, e.g. "February 2027". */
  nextEventWindow: string;
  socials: { discord: string; facebook: string };
}

export interface Cta {
  label: string; // hero button, and the bar's desktop label
  short: string; // the bar's phone label; must fit 320px
  href: string;
  external: boolean;
}

export interface Stat {
  label: 'Date' | 'Tickets' | 'Games';
  lead?: string; // small text before the numeral ("Sat")
  big: string; // the Anton numeral ("12", "$15", "TBC")
  small: string[]; // small lines after it, one per line
  datetime?: string; // Date only, when a real date exists
  spoken?: string; // aria-label for Date, when the pieces don't read aloud
}

export interface HomeFunnel {
  title: string; // h1 text after the "OZ ORC:" kicker
  lead: [strong: string, plain: string];
  primary: Cta;
  discord: string;
  facebook: string;
  stats: [Stat, Stat, Stat]; // Date, Tickets, Games, in that order
  venue: string;
  gmLink?: { label: string; href: string };
  hasGames: boolean; // the bar's GAMES slot and #games exist only when true
}

function dateStat(
  currentEvent: Event | undefined,
  nextEventWindow: string
): Stat {
  if (currentEvent) {
    const { date } = currentEvent;
    const [year, month, day] = date.split('-').map(Number);
    // UTC, so the build machine's timezone can't move the weekday.
    const weekday = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
      'en-AU',
      { weekday: 'long', timeZone: 'UTC' }
    );
    const [monthWord] = longDate(date).split(' ');
    return {
      label: 'Date',
      lead: weekday.slice(0, 3),
      big: String(day),
      small: [monthWord.slice(0, 3), String(year)],
      datetime: date,
      spoken: `${weekday}, ${longDate(date)}`,
    };
  }
  // Free text in events.ts; anything but "Month YYYY" would print a garbled
  // stat, so fail the build instead.
  if (!/^[A-Z][a-z]+ \d{4}$/.test(nextEventWindow)) {
    throw new Error(
      `nextEventWindow "${nextEventWindow}" must read like "February 2027".`
    );
  }
  const [monthWord, year] = nextEventWindow.split(' ');
  return { label: 'Date', big: 'TBC', small: [monthWord.slice(0, 3), year] };
}

export function homeFunnel({
  currentEvent,
  latestEvent,
  gmApplications,
  nextEventWindow,
  socials,
}: FunnelState): HomeFunnel {
  const warhornUrl = currentEvent?.warhornUrl;
  const gameCount = currentEvent?.games.length ?? 0;

  // Three states: registration open, event announced but not open, off-season.
  const [lead, primary]: [HomeFunnel['lead'], Cta] = warhornUrl
    ? [
        [
          "Ready to join Adelaide's premier old-school gaming convention?",
          'Sign up now or join our Discord community!',
        ],
        {
          label: 'Sign Up for Event',
          short: 'Sign Up',
          href: warhornUrl,
          external: true,
        },
      ]
    : currentEvent
      ? [
          [
            "Adelaide's premier old-school gaming convention returns — and we're recruiting GMs now.",
            'Register your interest below, or join our Discord to stay in the loop!',
          ],
          {
            label: 'Register Your Interest',
            short: 'Register',
            href: '#register',
            external: false,
          },
        ]
      : [
          [
            `Adelaide's premier old-school gaming convention returns in ${nextEventWindow}.`,
            'Join the mailing list to hear first when the date and games are announced, and come hang out on our Discord in the meantime.',
          ],
          {
            label: 'Join the Mailing List',
            short: 'Join List',
            href: '#register',
            external: false,
          },
        ];

  // Off-season there's no current price, so quote the last event's.
  const { price } = currentEvent ?? latestEvent;

  const games: Stat =
    gameCount > 0
      ? { label: 'Games', big: String(gameCount), small: ['on the', 'table'] }
      : gmApplications
        ? { label: 'Games', big: 'GMs', small: ['wanted'] }
        : { label: 'Games', big: 'TBA', small: ['games'] };

  return {
    title: `Adelaide's Old-School D&D & OSR Convention${currentEvent ? ` ${currentEvent.date.slice(0, 4)}` : ''}`,
    lead,
    primary,
    discord: socials.discord,
    // The Facebook button always shows: the event's page when there is one.
    facebook: currentEvent?.facebookEventUrl ?? socials.facebook,
    stats: [
      dateStat(currentEvent, nextEventWindow),
      { label: 'Tickets', big: `$${price.amount}`, small: [price.currency] },
      games,
    ],
    venue: currentEvent?.venue.name ?? 'Adelaide — venue TBC',
    gmLink: gmApplications && {
      label: `GMs wanted: apply by ${longDate(gmApplications.closes).split(',')[0]}`,
      href: '/gm-submission',
    },
    hasGames: gameCount > 0,
  };
}
