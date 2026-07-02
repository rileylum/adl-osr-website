// Organization (Site) module — the single owner of OZ ORC's global facts.
// These are shared across every event and region: brand name, canonical site
// URL, socials, contact email, default OG image. Consumers (OrganizationSchema,
// Footer, SEO, Hero, CodeOfConduct, gm-info, ...) read from here so each fact is
// typed exactly once. See docs/agent/CONTEXT.md (Organization/Site).

export interface Socials {
  discord: string;
  facebook: string;
  instagram: string;
  bluesky: string;
}

/** The org's mailing locality, used in OrganizationSchema's PostalAddress.
 *  Distinct from an Event's Venue address (a specific venue in a region). */
export interface OrgAddress {
  locality: string;
  region: string;
  country: string;
}

export interface Site {
  /** Brand name — the organization's short name. */
  name: string;
  /** Longer marketing site name used as the OpenGraph `og:site_name`. */
  seoName: string;
  /** Organization description used in OrganizationSchema. */
  description: string;
  /** Canonical site URL, no trailing slash. */
  url: string;
  /** Default OpenGraph / logo image, site-root-relative. */
  ogImage: string;
  /** Contact email for organizers. */
  email: string;
  socials: Socials;
  address: OrgAddress;
}

export const site: Site = {
  name: 'OZ ORC',
  seoName: 'OZ ORC - Adelaide OSR Gaming Convention',
  description:
    "Adelaide's premier old-school roleplaying convention for OSR and classic D&D gaming",
  url: 'https://ozorc.com',
  ogImage: '/images/OZORC_Dungeon.jpg',
  email: 'convention@ozorc.com',
  socials: {
    discord: 'https://discord.gg/BNehJG2xP4',
    facebook: 'https://www.facebook.com/profile.php?id=61582507863401',
    instagram: 'https://www.instagram.com/oz.orc',
    bluesky: 'https://bsky.app/profile/oz-orc.bsky.social',
  },
  address: {
    locality: 'Adelaide',
    region: 'SA',
    country: 'AU',
  },
};

/** Absolute URL for the default OG / logo image. Resolved with `URL` (as
 *  SEO.astro does) so a trailing slash on `url` or a missing leading slash on
 *  `ogImage` can't produce a malformed path. */
export const ogImageUrl = new URL(site.ogImage, site.url).href;
