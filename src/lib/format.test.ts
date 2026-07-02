import { describe, it, expect } from 'vitest';
import { mil, friendly, iso, address } from './format';

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
