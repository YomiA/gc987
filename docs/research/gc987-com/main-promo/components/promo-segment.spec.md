# PromoSegment specification

## Overview

- **Target file:** `src/components/promo/PromoSegment.vue`
- **Screenshot:** `docs/design-references/gc987-com/main-promo/promo-viewport-390.png`
- **Interaction model:** click-driven (in-page panel switch; the URL stays `/main/promo`)

## DOM structure

`ion-header` → `ion-toolbar.toolbar-segment` → `ion-segment.segment-scrollable` →
six `ion-segment-button`, each with an `ion-label` and a shadow
`.segment-button-indicator > .segment-button-indicator-background`.

## Computed styles (getComputedStyle, 390x844x3)

### Header / toolbar

- `ion-header`: 390x50, `position: relative`, `z-index: 10`
- `ion-toolbar` custom props: `--background: #154084`, `--min-height: 3.125rem`,
  `--padding-top/-bottom/-start/-end: 0`
- shadow `.toolbar-background`: 390x50, `background-color: rgb(21, 64, 132)`, `z-index: -1`
- shadow `.toolbar-container`: 390x50, `display: flex`, `justify-content: space-between`,
  `align-items: center`, `overflow: hidden`

### ion-segment

- 390x50, `padding: 0 10px`, `display: flex`, `justify-content: left`,
  `align-items: stretch`, `contain: paint`
- `overflow-x: auto`, `scrollbar-width: none`, `::-webkit-scrollbar { display: none }`
- `scrollWidth` 487, `clientWidth` 390, initial `scrollLeft` 0

### ion-segment-button (host)

- height 50 (full), `display: flex`, `flex-direction: column`, `flex: 0 1 auto`
- `font-size: 14px`, `line-height: 40px`, `text-transform: uppercase`,
  `white-space: nowrap`
- `--color: rgba(255,255,255,0.6)`, `--color-checked: #38a8fa`,
  `--indicator-color: #38a8fa`, `--indicator-box-shadow: none`, `--background: none`

### shadow .button-native

- `padding: 0 10px`, `display: flex`, `flex-direction: column`,
  `justify-content: center`, `align-items: center`, `overflow: hidden`,
  `z-index: 2`, `flex-grow: 1`
- `transition: color 0.15s linear, opacity 0.15s linear`

### ion-label (the visible text)

- `font-size: 14px`, `line-height: 22px`, height 22, `text-transform: none`,
  `text-align: center`, `white-space: nowrap`, `overflow: hidden`, `max-width: 100%`
- checked color `rgb(255, 255, 255)`; unchecked color `rgb(109, 120, 141)`

### shadow .segment-button-indicator

- `position: absolute`, `top: 48px`, `left: 0`, `right: 0`, height 2
- `transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)`
- `will-change: transform, opacity`; `opacity: 1` when checked, `0` otherwise

### shadow .segment-button-indicator-background

- height 2, full button width
- `background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%)`

## Measured button widths (label width + 20px padding)

| Label | Button width | Label width | x |
|---|---|---|---|
| Eventos | 69.28 | 49.28 | 10 |
| Rebate | 63.53 | 43.53 | 79.28 |
| VIP | 41.55 | 21.55 | 142.81 |
| Código de Resgate | 137.27 | 117.27 | 184.37 |
| Histórico | 76.51 | 56.51 | 321.63 |
| Pendente | 78.95 | 58.95 | 398.14 |

Sum 467.09 + 2x10 padding = 487 = `scrollWidth`. Widths are pure text metrics
(14px Roboto 400), so the clone must not set explicit widths.

## States & behaviors

### Active tab

- **Trigger:** tap on a button
- **State A (unchecked):** label `rgb(109,120,141)`, indicator `opacity: 0`
- **State B (checked):** label `rgb(255,255,255)`, indicator `opacity: 1`
- **Transition:** label `color 0.15s linear`; indicator
  `transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)`
- Default on load: `Eventos` checked, `scrollLeft` 0

### Panel switch

Tapping `Rebate` keeps the URL at `/main/promo` and replaces the `ion-content`
children with a different sub-view (3 children, e.g. "Pode ser coletado hoje：0,00 /
Slot / Receber / Histórico"). Only the `Eventos` panel is in scope for this clone.

## Text content (verbatim, in order)

`Eventos`, `Rebate`, `VIP`, `Código de Resgate`, `Histórico`, `Pendente`

## Responsive behavior

The whole app is one centred column capped at `--app-max-width: 486px`, and every
length here is a rem against `min(100vw, 486px) / 24.375`. The segment therefore keeps
its proportions and stays horizontally scrollable at 375/390/486px. No breakpoint
switches layout.
