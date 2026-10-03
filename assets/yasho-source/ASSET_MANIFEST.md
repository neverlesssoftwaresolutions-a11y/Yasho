# YASHO Source Asset Manifest

Fetched on: 2026-10-03

## Saved assets

- `instagram-profile.html`
  - Source: https://www.instagram.com/yashocoffeehouse/
  - Public profile HTML snapshot.

- `instagram-profile-logo.jpg`
  - Source: Instagram `og:image` metadata from the public profile page.
  - Notes: 100x100 profile image only. This appears to be the YASHO mark, but it is too low-resolution for a premium website header or large brand intro.

- `google-maps-search.html`
  - Source: Google Maps search URL for YASHO Coffee House, Kolhapur.
  - Notes: Search page snapshot. It did not expose usable business photo URLs.

- `extracted-media-urls.txt`
  - Source: URLs extracted from the Instagram profile HTML.
  - Notes: Only the profile image and Instagram static assets were exposed; public post images/videos were not exposed.

- `google-extracted-media-urls.txt`
  - Source: URLs extracted from the Google Maps search snapshot.
  - Notes: No YASHO cafe photos were exposed.

## Blocked or unavailable

- Instagram public post images/videos:
  - The static profile page did not expose post media URLs.
  - Instagram's public profile JSON endpoint returned HTTP 429 from this environment.

- Google Maps business photos/videos:
  - The supplied short Maps URL did not connect from this environment.
  - The Google Maps search page loaded, but did not expose usable YASHO photo URLs.

- Third-party Instagram mirror:
  - `imginn.com/yashocoffeehouse` returned a Cloudflare challenge, so it was not used.

## Needed before final visual identity

Please provide at least:

- High-resolution original YASHO logo, preferably SVG or transparent PNG.
- 6-10 original cafe photographs: exterior/signage, interiors, coffee, matcha, desserts, sandwich, ambience.
- Any menu images or food/drink photography approved for website use.
- Optional short video clips if a video hero or reel-style section is desired.

