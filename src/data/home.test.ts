import { describe, it, expect, afterEach } from 'vitest';
import { homeFunnel, type FunnelState } from './home';
import type { Event } from './events';

// homeFunnel reads date, price, warhornUrl, facebookEventUrl, venue.name and
// the game count from an event. Worked examples below were derived by hand
// from the Sep 2026 event and the old Hero copy.
const sep2026 = {
  date: '2026-09-12',
  price: { amount: '15', currency: 'AUD' },
  warhornUrl: 'https://warhorn.net/events/ozorc-adelaide-september-2026',
  facebookEventUrl: 'https://www.facebook.com/share/1HQ8CNDTai/',
  venue: { name: 'Colonel Light Gardens RSL' },
  games: Array.from({ length: 17 }, () => ({})),
} as Event;

const socials = {
  discord: 'https://discord.gg/vVqQNBtFbZ',
  facebook: 'https://www.facebook.com/profile.php?id=61582507863401',
};

const gmApplications = { formUrl: 'https://f', closes: '2026-11-30' };

const registrationOpen: FunnelState = {
  currentEvent: sep2026,
  latestEvent: sep2026,
  gmApplications,
  nextEventWindow: 'February 2027',
  socials,
};

const offSeason: FunnelState = {
  ...registrationOpen,
  currentEvent: undefined,
};

describe('homeFunnel, registration open', () => {
  const funnel = homeFunnel(registrationOpen);

  it('sends Sign Up to Warhorn in a new tab', () => {
    expect(funnel.primary).toEqual({
      label: 'Sign Up for Event',
      short: 'Sign Up',
      href: 'https://warhorn.net/events/ozorc-adelaide-september-2026',
      external: true,
    });
  });

  it('shows the date, price and game count as stats', () => {
    expect(funnel.stats[0]).toEqual({
      label: 'Date',
      lead: 'Sat',
      big: '12',
      small: ['Sep', '2026'],
      datetime: '2026-09-12',
      spoken: 'Saturday, September 12th, 2026',
    });
    expect(funnel.stats[1]).toEqual({
      label: 'Tickets',
      big: '$15',
      small: ['AUD'],
    });
    expect(funnel.stats[2]).toEqual({
      label: 'Games',
      big: '17',
      small: ['on the', 'table'],
    });
  });

  it("links the event's Facebook page", () => {
    expect(funnel.facebook).toBe('https://www.facebook.com/share/1HQ8CNDTai/');
  });

  it('carries the year in the title and the sign-up lead', () => {
    expect(funnel.title).toBe(
      "Adelaide's Old-School D&D & OSR Convention 2026"
    );
    expect(funnel.lead).toEqual([
      "Ready to join Adelaide's premier old-school gaming convention?",
      'Sign up now or join our Discord community!',
    ]);
  });

  it('links GM applications with their closing day', () => {
    expect(funnel.gmLink).toEqual({
      label: 'GMs wanted: apply by November 30th',
      href: '/gm-submission/',
    });
  });

  it('has games', () => {
    expect(funnel.hasGames).toBe(true);
  });
});

describe('homeFunnel, off-season', () => {
  const funnel = homeFunnel(offSeason);

  it('sends Sign Up to the mailing list on the page', () => {
    expect(funnel.primary).toEqual({
      label: 'Join the Mailing List',
      short: 'Join List',
      href: '#register',
      external: false,
    });
  });

  it('shows the next event window as a TBC date, with no datetime', () => {
    expect(funnel.stats[0]).toEqual({
      label: 'Date',
      big: 'TBC',
      small: ['Feb', '2027'],
    });
    expect(funnel.stats[0].datetime).toBeUndefined();
  });

  it("quotes the last event's price and asks for GMs", () => {
    expect(funnel.stats[1]).toEqual({
      label: 'Tickets',
      big: '$15',
      small: ['AUD'],
    });
    expect(funnel.stats[2]).toEqual({
      label: 'Games',
      big: 'GMs',
      small: ['wanted'],
    });
  });

  it('falls back to the Facebook profile and an unconfirmed venue', () => {
    expect(funnel.facebook).toBe(socials.facebook);
    expect(funnel.venue).toBe('Adelaide — venue TBC');
  });

  it('drops the year from the title and has no games', () => {
    expect(funnel.title).toBe("Adelaide's Old-School D&D & OSR Convention");
    expect(funnel.hasGames).toBe(false);
  });

  it('shows no GM link and no games once applications close', () => {
    const closed = homeFunnel({ ...offSeason, gmApplications: undefined });
    expect(closed.gmLink).toBeUndefined();
    expect(closed.stats[2]).toMatchObject({ big: 'TBA', small: ['games'] });
  });

  it('throws on a next event window it cannot print as a date', () => {
    expect(() =>
      homeFunnel({ ...offSeason, nextEventWindow: 'Autumn-ish' })
    ).toThrow();
  });
});

describe('homeFunnel, announced', () => {
  const announced = {
    ...sep2026,
    warhornUrl: '',
    facebookEventUrl: undefined,
    games: [],
  } as Event;
  const funnel = homeFunnel({ ...registrationOpen, currentEvent: announced });

  it('sends Sign Up to the register-interest form', () => {
    expect(funnel.primary.label).toBe('Register Your Interest');
    expect(funnel.primary.href).toBe('#register');
  });

  it('asks for GMs and falls back to the Facebook profile', () => {
    expect(funnel.stats[2]).toMatchObject({ big: 'GMs', small: ['wanted'] });
    expect(funnel.facebook).toBe(socials.facebook);
  });
});

describe('homeFunnel weekday', () => {
  const tz = process.env.TZ;
  afterEach(() => {
    process.env.TZ = tz;
  });

  // Kiritimati is UTC+14 and Pago Pago UTC-11: a local-time weekday would be
  // a day off in one of them.
  for (const zone of ['Pacific/Kiritimati', 'Pacific/Pago_Pago']) {
    it(`is Saturday for 2026-02-07 in ${zone}`, () => {
      process.env.TZ = zone;
      const funnel = homeFunnel({
        ...registrationOpen,
        currentEvent: { ...sep2026, date: '2026-02-07' },
      });
      expect(funnel.stats[0].lead).toBe('Sat');
    });
  }
});
