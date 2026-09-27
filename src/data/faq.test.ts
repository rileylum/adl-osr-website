import { describe, it, expect } from 'vitest';
import { homeFaqs, plainText, faqPageSchema, type FaqState } from './faq';
import type { Event } from './events';

// homeFaqs reads only price and warhornUrl from an event.
const event = {
  price: { amount: '15', currency: 'AUD' },
  warhornUrl: 'https://warhorn.net/events/x',
} as Event;

const offSeason: FaqState = {
  currentEvent: undefined,
  latestEvent: event,
  gmApplications: undefined,
  discordUrl: 'https://discord.gg/x',
};

const answer = (state: FaqState, question: string) =>
  homeFaqs(state).find((faq) => faq.question === question)!.answer;

describe('plainText', () => {
  it('keeps link text and drops the href', () => {
    expect(
      plainText(['Book on ', { text: 'Warhorn', href: 'https://w' }, '.'])
    ).toBe('Book on Warhorn.');
  });
});

describe('homeFaqs', () => {
  it('quotes the last event price off-season and links Discord', () => {
    const cost = answer(offSeason, 'How much does it cost?');
    expect(plainText(cost)).toMatch(
      /^Tickets for our last event were \$15 AUD/
    );
    expect(cost).toContainEqual({
      text: 'join our Discord',
      href: 'https://discord.gg/x',
    });
  });

  it('links Warhorn and says cash at the door while an event is current', () => {
    const cost = answer(
      { ...offSeason, currentEvent: event },
      'How much does it cost?'
    );
    expect(plainText(cost)).toMatch(/^Tickets are \$15 AUD per person/);
    expect(plainText(cost)).toContain('pay cash at the door');
    expect(cost).toContainEqual({
      text: 'Warhorn event page',
      href: event.warhornUrl,
    });
  });

  it('gives the closing date and form link while GM applications are open', () => {
    const gm = answer(
      {
        ...offSeason,
        gmApplications: { formUrl: 'https://f', closes: '2026-11-30' },
      },
      'Can I run a game as a GM?'
    );
    expect(plainText(gm)).toContain('Applications close November 30th, 2026');
    expect(gm).toContainEqual({
      text: 'Game Submission',
      href: '/gm-submission',
    });
  });
});

describe('faqPageSchema', () => {
  it('has one Question per FAQ with the answer as plain text', () => {
    const faqs = homeFaqs(offSeason);
    const schema = faqPageSchema(faqs);
    expect(schema.mainEntity.map((q) => q.name)).toEqual(
      faqs.map((f) => f.question)
    );
    expect(schema.mainEntity[1].acceptedAnswer.text).toBe(
      plainText(faqs[1].answer)
    );
  });
});
