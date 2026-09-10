# PromoEventCard specification

## Overview

- **Target file:** `src/components/promo/PromoEventCard.vue`
- **Screenshots:** `promo-viewport-390.png` (cards 1–6),
  `promo-scroll-670-390.png` (cards 6–11), `promo-scroll-bottom-390.png` (cards 9–14)
- **Interaction model:** static (no scroll/hover behavior); two cards carry an
  infinite CSS `shiny` sweep

## DOM structure

```
div.mb-2.5.rounded-[.625rem].relative      ← the card box, carries the banner as background
├── ion-item.item.item-lines-default[.shiny]  ← 120px hit area, clips the sweep
└── p.red-point.absolute…                     ← 14px badge, display:none unless flagged
```

## Computed styles (getComputedStyle, 390x844x3)

### Card box

- 360x124, `min-height: 124px`, `display: block`, `position: relative`
- `margin: 0 0 10px`
- `border-radius: 10px`
- `background-image: url(<banner>)`, `background-size: 100% auto`,
  `background-repeat: no-repeat`, `background-position: 0% 0%`,
  `background-clip: border-box`, `background-origin: padding-box`
- `cursor: auto` (the live card does not switch the cursor)

The banner is 660x220, so `100% auto` renders it 360x120 inside the 124px box; the
bottom 4px of the box is empty page background.

### ion-item (hit area)

- host: 360x120, `display: block`, `position: relative`, `overflow: hidden`
- custom props: `--background: transparent`, `--min-height: 7.5rem`,
  `--padding-start: 15px`, `--inner-padding-end: 0px`, `--border-width: 0px`
- shadow `.item-native`: 360x120, `padding: 0 15px`, `display: flex`,
  `align-items: center`, `border-radius: 10px`, `overflow: hidden`, `z-index: 1`
- shadow `.item-inner`: 330x120 (360 − 2x15)
- the item holds no text

### p.red-point (badge)

- classes: `absolute bg-[#FF0000] text-center rounded-full top-0 right-0
  -translate-y-1/4 translate-x-1/4`
- 14x14 (`--v: .875rem` drives width, height and line-height),
  `background-color: rgb(255, 0, 0)`, `border-radius: 9999px`, `z-index: 100`
- `font-size: 10px`, `line-height: 14px`, `color: rgb(255,255,255)`,
  `text-align: center`, no text content
- resolved box on card 6: x=364.5, y=726.5 (card top −3.5, card right +3.5)
- `display: none` on all cards except #6 and #7

## States & behaviors

### shiny sweep (cards #6 and #7 only)

Live rule:

```css
ion-item.shiny::before {
  content: '';
  animation: 6s ease-in-out 0s infinite normal none running shiny-f8484f4b;
  background: rgb(255, 255, 255);
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px;
  z-index: 100;
}
@keyframes shiny-f8484f4b {
  0%   { opacity: 0;   transform: scale(0) rotate(45deg); }
  50%  { opacity: 0.3; transform: scale(0) rotate(45deg); }
  81%  { opacity: 0.6; transform: scale(4) rotate(45deg); }
  100% { opacity: 0;   transform: scale(50) rotate(45deg); }
}
```

- **Trigger:** none, runs forever from mount
- **Clip:** the host's `overflow: hidden` keeps the flash inside the 360x120 item
- Other components on the site use the same keyframe shape at 4s/5s; the promo card
  is the 6s / 0.3 / 0.6 opacity variant.

### Hover / press

No hover or active rule changes any card property; `--background-hover` resolves to
`currentColor` (Ionic default) but is never applied at this viewport.

## Text content

None — all copy is baked into the banner PNGs.

## Responsive behavior

Card width follows the content column (`ion-content` side padding 15px), so it is
100% of the available width at every viewport; height is the rem-scaled 7.75rem.
No breakpoint switches layout.
