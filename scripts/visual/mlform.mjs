// Puts the homepage's MailerLite form into its error or success state for the
// visual checks, without ever sending a subscription: a real submit adds a
// subscriber and sends a double-opt-in email.

// Puts the MailerLite form on `page` into `state`, never sending a subscription.
// state: 'error' | 'success'
export async function setFormState(page, state) {
  // The safety net: no subscribe request can leave the browser, even if
  // validation passes by accident. Don't widen this to `jsonp` — the form
  // itself loads from …/jsonp/…/forms/B6FVva, and blocking that stops it
  // rendering.
  await page.route(/mailerlite\.com\/.*subscribe/, (r) => r.abort());
  await page.waitForSelector('.ml-embedded button.primary');

  if (state === 'error') {
    // An empty submit: MailerLite's validator marks the email group and the
    // consent row with .ml-error and posts nothing. Typing an invalid address
    // instead raises the browser's own validation bubble over the form.
    await page.click('.ml-embedded button.primary');
    await page.waitForSelector('.ml-embedded .ml-error');
  } else if (state === 'success') {
    // MailerLite's own success handler swaps .row-form for .row-success,
    // exactly as a successful submit does.
    const shown = await page.evaluate(() => {
      const key = Object.keys(window).find((k) =>
        k.startsWith('ml_webform_success_')
      );
      if (!key) return false;
      window[key]();
      return true;
    });
    // A silent pass here would hide that the embed has changed.
    if (!shown) throw new Error('no ml_webform_success_* on the page');
    await page.waitForSelector('.ml-embedded .row-success', {
      state: 'visible',
    });
  } else {
    throw new Error(`unknown form state: ${state}`);
  }
  await page.waitForTimeout(200);
}
