# ToTopButton Specification

## Overview
- **Target file:** `src/components/inicio/ToTopButton.vue`
- **Source:** `https://gc987.com/main/inicio` `.to-top-box.defaultTwo` (theme `blue-default`)
- **Interaction model:** scroll-driven show/hide + click-to-scroll-top

## DOM Structure
```
div.to-top-box.defaultTwo
  i.icon-wall
    ion-icon.icon  src=/svg/to-top2.svg
  span.to-top-text  TOP
```

Parent inline: `bottom: calc(56px + env(safe-area-inset-bottom) + 1rem)`.
Live uses `position: fixed`. Clone uses `absolute` on `.ion-page` (same pattern as SupportButton) so it stays on the 390 column.

## Computed Styles (getComputedStyle, blue-default)

### `.to-top-box`
- display: flex (or none)
- position: fixed/absolute
- right: 20px (1.25rem)
- bottom: 72px (3.5rem tab + 1rem)
- width/height: 40px (2.5rem)
- border-radius: 50%
- z-index: 50
- flex-flow: column
- justify-content: flex-end
- align-items: center
- background: rgb(77, 163, 65)
- font-size: 10px
- color: #fff

### `.icon-wall`
- 22×22 (1.375rem), font-size 1.375rem
- display flex, center
- padding-top: 16px (1rem)
- color #fff

### `.to-top-text`
- 12px / 18px, weight 500
- margin-bottom: 2px (0.125rem)
- color #fff
- text: TOP

## States & Behaviors

### Show / hide
- **Trigger:** live `watchBuoy` IntersectionObserver: intersecting index **> 2** shows, **<= 2** hides. If **no** `.game-block` intersects (footer), **keep the last state** so TOP stays visible at the bottom.
- **State A:** `display: none` at scroll top / first three `.game-block`s.
- **State B:** `display: flex` once a 4th+ `.game-block` has intersected, including after scrolling past all game blocks into the footer.
- **Implementation:** on `.main-content` scroll, take the highest intersecting `.game-block` index; `> 2` → show, `0..2` → hide. If none intersect, show when the 4th block has already scrolled above the scroller (footer). Hide on provider change.

### Click
- Scroll `.main-content` to 0 with the existing 300ms easeOutCubic `scrollToPoint` clone.

## Assets
- `src/assets/icons/to-top.svg` from `/svg/to-top2.svg`

## Responsive Behavior
- 390 column only. `right: 1.25rem` relative to `.ion-page`, not the window.
