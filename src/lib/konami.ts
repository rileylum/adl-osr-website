const CODE =
  'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a';
const LENGTH = CODE.split(' ').length;

/** Feed it every keydown's `event.key`; it returns true only on the key that
 *  completes ↑ ↑ ↓ ↓ ← → ← → B A, then starts over. */
export function createKonami(): (key: string) => boolean {
  let recent: string[] = [];
  return (key) => {
    // Lower-case letters only: `ArrowUp` must keep its case to match.
    const k = key.length === 1 ? key.toLowerCase() : key;
    recent = [...recent, k].slice(-LENGTH);
    return recent.join(' ') === CODE;
  };
}
