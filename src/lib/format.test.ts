import { describe, it, expect } from 'vitest';
import { mil, friendly, iso, longDate, address } from './format';

describe('mil (timetable / military form)', () => {
  it('strips the colon', () => {
    expect(mil('09:30')).toBe('0930');
    expect(mil('12:30')).toBe('1230');
    expect(mil('21:30')).toBe('2130');
  });

  it('handles midnight and noon', () => {
    expect(mil('00:00')).toBe('0000');
    expect(mil('12:00')).toBe('1200');
  });

  it('pads a single-digit hour', () => {
    expect(mil('9:00')).toBe('0900');
  });
});

describe('friendly (session-heading form)', () => {
  it('uses a 12-hour clock with an un-padded hour and padded minutes', () => {
    expect(friendly('09:30')).toBe('9:30AM');
    expect(friendly('12:30')).toBe('12:30PM');
    expect(friendly('18:30')).toBe('6:30PM');
    expect(friendly('21:30')).toBe('9:30PM');
  });

  it('renders midnight as 12:00AM and noon as 12:00PM', () => {
    expect(friendly('00:00')).toBe('12:00AM');
    expect(friendly('12:00')).toBe('12:00PM');
  });

  it('handles the AM/PM boundary', () => {
    expect(friendly('11:59')).toBe('11:59AM');
    expect(friendly('12:01')).toBe('12:01PM');
    expect(friendly('00:01')).toBe('12:01AM');
    expect(friendly('13:00')).toBe('1:00PM');
  });
});

describe('iso (schema.org datetime with offset)', () => {
  it('composes date + time + offset into a valid schema.org datetime', () => {
    expect(iso('2026-02-07', '09:00', '+10:30')).toBe(
      '2026-02-07T09:00:00+10:30'
    );
    expect(iso('2026-02-07', '21:30', '+10:30')).toBe(
      '2026-02-07T21:30:00+10:30'
    );
  });

  it('appends seconds and pads a single-digit hour', () => {
    expect(iso('2026-02-07', '9:05', '+10:30')).toBe(
      '2026-02-07T09:05:00+10:30'
    );
  });

  it('works with a different region offset', () => {
    expect(iso('2026-03-14', '00:00', '+11:00')).toBe(
      '2026-03-14T00:00:00+11:00'
    );
  });
});

describe('longDate (friendly long-date heading)', () => {
  it('renders the current event date as shown in the hero', () => {
    expect(longDate('2026-02-07')).toBe('February 7th, 2026');
  });

  it('applies the correct ordinal suffix', () => {
    expect(longDate('2026-02-01')).toBe('February 1st, 2026');
    expect(longDate('2026-02-02')).toBe('February 2nd, 2026');
    expect(longDate('2026-02-03')).toBe('February 3rd, 2026');
    expect(longDate('2026-02-04')).toBe('February 4th, 2026');
    expect(longDate('2026-02-21')).toBe('February 21st, 2026');
    expect(longDate('2026-02-22')).toBe('February 22nd, 2026');
    expect(longDate('2026-02-23')).toBe('February 23rd, 2026');
  });

  it('uses "th" for the 11–13 exception', () => {
    expect(longDate('2026-02-11')).toBe('February 11th, 2026');
    expect(longDate('2026-02-12')).toBe('February 12th, 2026');
    expect(longDate('2026-02-13')).toBe('February 13th, 2026');
  });

  it('does not shift the day across a timezone boundary', () => {
    // A naive `new Date("2026-02-07")` parses as UTC midnight and can render as
    // the 6th in negative offsets; the parts-based parse must stay on the 7th.
    expect(longDate('2026-02-07')).toContain('7th');
    expect(longDate('2026-12-31')).toBe('December 31st, 2026');
    expect(longDate('2026-01-01')).toBe('January 1st, 2026');
  });
});

describe('address (free-text venue line)', () => {
  it('joins the structured parts into the current free-text line', () => {
    expect(
      address({
        street: '4 Prince George Parade',
        suburb: 'Colonel Light Gardens Adelaide',
        region: 'SA',
        postcode: '5041',
        country: 'AU',
      })
    ).toBe('4 Prince George Parade, Colonel Light Gardens Adelaide, SA, 5041');
  });

  it('omits the country from the display line', () => {
    const line = address({
      street: '1 Example St',
      suburb: 'Testville',
      region: 'VIC',
      postcode: '3000',
      country: 'AU',
    });
    expect(line).toBe('1 Example St, Testville, VIC, 3000');
    expect(line).not.toContain('AU');
  });

  it('skips an empty part rather than emitting a doubled separator', () => {
    expect(
      address({
        street: '4 Prince George Parade',
        suburb: '',
        region: 'SA',
        postcode: '5041',
        country: 'AU',
      })
    ).toBe('4 Prince George Parade, SA, 5041');
  });
});
