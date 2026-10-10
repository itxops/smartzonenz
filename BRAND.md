# SmartZone — Brand Palette

This site modernises the existing SmartZone NZ website. It is **not** a rebrand.
Every colour below was measured from the live site (https://smartzonenz.co.nz/) —
its compiled stylesheet, the logo PNG and the favicon / app icon — on 2026-10-10.
Do not introduce colours outside this list.

## Brand colours

| Token | Hex | Source on original site | Used for |
|---|---|---|---|
| `--brand` | `#F07800` | `bg-brand`, `text-brand`, `border-brand` | Primary buttons, accents, icons, highlights |
| `--brand-dark` | `#C05F00` | `hover:bg-brand-dark` | Button hover, and orange **text** on light backgrounds |
| `--brand-light` | `#FFF3E6` | `bg-brand-light` | Soft icon / badge backgrounds |
| `--brand-soft` | `#FF9F13` | Favicon + apple-touch-icon background | Secondary accent on dark (gradients, small highlights) |
| `--ink` | `#0F1115` | `bg-surface-dark`, `text-ink`, header | Header, dark sections, footer, text on orange buttons |

## Logo

- The logo (`images/smartzone-logo.png`) is **pure white on transparent**.
- It must always sit on `#0F1115` (the original header was dark for this reason).
- App icon / favicon: white mark on `#FF9F13`.

## Neutrals

| Role | Light backgrounds | Dark backgrounds |
|---|---|---|
| Surfaces | `#FFFFFF`, `#F7F7F8`, borders `#EEEEF0` | `#0F1115` (+ tonal `#16191E`, `#1F2228`) |
| Text | `#0F1115`, body `#3F3F46`, muted `#71717A`, faint `#94949C` | `#FFFFFF`, `#D4D4D8`, `#A1A1AA`, `#71717A`, `#52525B` |

## Accessibility rules

- **Orange buttons use dark `#0F1115` text** (6.6:1 contrast). This follows the original
  header "Call Now" button. White on `#F07800` is only ~2.9:1. On hover the button
  darkens to `#C05F00` with white text.
- **Small orange text on white** uses `#C05F00` (~4.3:1). `#F07800` is kept for icons,
  fills and for orange text on the dark `#0F1115` background (6.6:1).

## Typography

- Original: Barlow Condensed (headings, uppercase) + DM Sans (body).
- Current: Bricolage Grotesque for all text, with Instrument Serif italic for accent words,
  chosen at the owner's request.
