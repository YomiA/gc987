# /main/promo — behavior sweep

Extracted at `390x844x3, mobile, touch` on the live page.

## Scroll sweep

- The only scroller is `ion-content` (`scrollHeight` 1958, `clientHeight` 794,
  max `scrollTop` 1164). The document itself does not scroll, so a full-page
  screenshot equals a viewport screenshot.
- The segment header sits outside `ion-content` and therefore never moves,
  changes height, or gains a shadow at any scroll position.
- No element animates in on entry, no scroll-snap, no parallax, no
  scroll-driven tab switching, no smooth-scroll library on this route.
- The scrollbar is suppressed (`::part(scroll) { scrollbar-width: none }`).

## Click sweep

- **Segment buttons** switch panels in place; the URL stays `/main/promo`.
  `Rebate` for example replaces the 14 cards with a 3-child rebate view
  ("Pode ser coletado hoje：0,00 / Slot / Receber / Histórico").
  Only the default `Eventos` panel is in scope for this clone.
- **Cards** are `ion-item`s with no visible state change on tap at this viewport.
- **Bottom tab bar** is app-level: `Inicio` returns to `/main/inicio`.

## Hover sweep

No hover rule changes any property of the segment buttons or the cards. Both
`--background-hover` and `--ripple-color` resolve to Ionic's `currentColor`
default and are never applied on a touch viewport.

## Time-driven

Cards 6 (`menber.png`) and 7 (`4.png`) run an infinite 6s white sweep on the
`ion-item::before` pseudo-element. Full keyframes in
`components/promo-event-card.spec.md`. Nothing else animates on a timer.

## Segment indicator

The checked button's own 2px indicator is opacity 1 while the others are 0, with
`transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)`. On load `Eventos` is
checked with `scrollLeft` 0 and the indicator already in place — it does not
slide in from the left.

## Responsive

The whole app is one centred column capped at 486px with the root font size set
to `min(100vw, 486px) / 24.375`, so every length is a rem against that. Nothing
on this page has a media query; at 375/390/486px the layout only scales, and the
segment stays horizontally scrollable (`scrollWidth` 487 at a 390px column).
