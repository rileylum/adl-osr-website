// Homepage FAQ — the single source for both the visible accordion and the
// FAQPage JSON-LD. Answers are runs of text and links rather than HTML, so the
// page can render the links while the schema gets the same words as plain text.
// Edit an answer here and both outputs change together.

import type { Event, GmApplications } from './events';
import { longDate } from '../lib/format';

/** A run of answer text: a plain string, or a link. `href`s starting with
 *  `http` open in a new tab. */
export type Inline = string | { text: string; href: string };

export interface Faq {
  question: string;
  answer: Inline[];
}

/** The event state the answers depend on. Passed in rather than imported so
 *  tests can check every season against fixtures. */
export interface FaqState {
  currentEvent: Event | undefined;
  latestEvent: Event;
  gmApplications: GmApplications | undefined;
  discordUrl: string;
}

export function homeFaqs({
  currentEvent,
  latestEvent,
  gmApplications,
  discordUrl,
}: FaqState): Faq[] {
  // Off-season there's no current price, so quote the last event's and say so.
  const { price } = latestEvent;
  const priceText = `$${price.amount} ${price.currency}`;
  const priceLead = currentEvent
    ? `Tickets are ${priceText} per person.`
    : `Tickets for our last event were ${priceText} per person.`;
  const warhornUrl = currentEvent?.warhornUrl;

  return [
    {
      question: 'What is OSR?',
      answer: [
        'OSR stands for "Old-School Renaissance" or "Old-School Revival". It\'s a style of tabletop RPG gaming inspired by classic D&D and early Dungeons & Dragons editions. OSR games emphasize exploration, player creativity, and challenge, featuring high stakes, meaningful choices, and a focus on problem-solving.',
      ],
    },
    {
      question: 'How much does it cost?',
      // Warhorn handles seat booking only — there is no online payment, so the
      // answer has to say cash at the door or people turn up expecting to have
      // paid already.
      answer: warhornUrl
        ? [
            `${priceLead} Book your seats on our `,
            { text: 'Warhorn event page', href: warhornUrl },
            ' and pay cash at the door on the day.',
          ]
        : [
            `${priceLead} Registration opens closer to the event — `,
            { text: 'join our Discord', href: discordUrl },
            ' to be the first to know.',
          ],
    },
    {
      question: "I'm new to tabletop RPGs. Can I still attend?",
      answer: [
        "Absolutely! Our GMs are experienced at welcoming new players. You don't need to know the rules or bring a character - just bring yourself and a willingness to explore strange worlds.",
      ],
    },
    // {
    //   question: 'Do I need to bring my own character?',
    //   answer: [
    //     "No! Pre-generated characters will be provided for all games. You can jump right in and start playing. Of course, if you'd like to bring your own character, check with your GM first to see if it fits the game.",
    //   ],
    // },
    {
      question: 'Is there a minimum age to attend?',
      answer: [
        'Attendees under 18 are welcome but must be accompanied by a parent or guardian throughout the event, as the venue is licensed.',
      ],
    },
    {
      question: "What if I don't know anyone? Can I attend alone?",
      answer: [
        "Absolutely! Many attendees come solo and make new friends through gaming. You'll be seated with other players who share your love of old-school gaming.",
      ],
    },
    {
      question: 'Can I run a game as a GM?',
      answer: gmApplications
        ? [
            `Yes! We welcome GMs of all experience levels and are currently recruiting GMs for our next event. Applications close ${longDate(gmApplications.closes)} — check out the `,
            { text: 'Game Submission', href: '/gm-submission/' },
            ' page to submit your game proposal.',
          ]
        : [
            'Yes! We welcome GMs of all experience levels. Game submissions for our next event open once the date is set — ',
            { text: 'join our Discord', href: discordUrl },
            " and let us know what you'd like to run.",
          ],
    },
  ];
}

/** An answer as the plain text a reader sees, links included as their text. */
export function plainText(answer: Inline[]): string {
  return answer
    .map((part) => (typeof part === 'string' ? part : part.text))
    .join('');
}

/** schema.org FAQPage for the given questions. */
export function faqPageSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
    })),
  };
}
