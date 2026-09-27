import { describe, it, expect } from 'vitest';
import { createKonami } from './konami';

const CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const feed = (keys: string[]) => {
  const press = createKonami();
  return keys.map(press);
};

describe('createKonami', () => {
  it('returns true only on the key that completes the code', () => {
    expect(feed(CODE)).toEqual([...Array(9).fill(false), true]);
  });

  it('matches after an extra ArrowUp, with capital B and A', () => {
    const keys = ['ArrowUp', ...CODE.slice(0, 8), 'B', 'A'];
    expect(feed(keys)).toEqual([...Array(10).fill(false), true]);
  });

  it('never matches when another key breaks the sequence', () => {
    const keys = [...CODE.slice(0, 9), 'x', 'a'];
    expect(feed(keys)).not.toContain(true);
  });

  it('needs all ten keys again after a match', () => {
    const keys = [...CODE, 'a', ...CODE];
    expect(feed(keys)).toEqual([
      ...Array(9).fill(false),
      true,
      false,
      ...Array(9).fill(false),
      true,
    ]);
  });
});
