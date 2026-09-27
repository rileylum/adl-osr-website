/** Fired on `document` by GoldBoxChrome's script, right after <html data-look>
 *  changes and the page scrolls to the top. Cancelable: a listener that places
 *  focus itself calls preventDefault(), and the chrome then leaves focus alone. */
export const LOOK_CHANGE = 'oz-look-change';
export type LookChange = CustomEvent<{ look: 'h' | 'f' }>;
