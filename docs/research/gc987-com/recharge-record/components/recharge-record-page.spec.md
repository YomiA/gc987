# RechargeRecordPage Specification

## Overview
- **Target file:** `src/views/RechargeRecordPage.vue`
- **Screenshot:** `docs/design-references/gc987-com/recharge-record/live-default-390.png`
- **Interaction model:** click-driven
- **Reuse:** `SvgIcon` (`report-back`), `WithdrawTimeFilter`, `/images/promo-page/no-record.png`

## DOM Structure
```
.ion-page
  header.rec-header
    .toolbar
      button.back > SvgIcon.back-icon
      h1.toolbar-title > span.title-text
  .page-scroller.rec-body
    .top-area
      WithdrawTimeFilter
      .total-area > .amount
    .empty
      .empty-bg-img
      span.empty-label
```

## Computed Styles (390×844×3)

### Header / toolbar
- header: 390×50, `position: relative`, `z-index: 10`, `box-shadow: none`
- toolbar: flex, height/min-height `3.125rem`, padding `0 0.25rem`, `background-color: #101629` (`--color-bg-400`)

### Back
- host 42×50 @(4,0): width `2.625rem`, height `3.125rem`, padding `0 0.875rem`
- icon 14×14 @(18,18), `color: #fff` — same SVG as `report-back`

### Title
- absolute inset 0, padding `0 5.625rem`, flex center
- `font: 400 1rem/1.75rem`, color `--color-text-100`, `text-align: center`, `pointer-events: none`
- inner ellipsis nowrap

### Body
- padding `1rem`, background `--color-bar-bg` (`#090f1f`)

### `.top-area`
- display flex, space-between, align center, height `2rem`, width 358, margin `0 0 0.625rem`

### Total
- `font: 700 0.75rem/1.125rem` white
- `.amount` `display: inline-flex`, color `#27d48b`, weight 700

### Empty
- column, center, height `18rem`
- image `7.5rem`, `margin-top: 9rem`, `background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat`
- label `1rem/1.5rem` `rgb(99, 100, 105)`

## States & Behaviors
- Date pill: see `withdraw-time-filter.spec.md` (identical live component). Changing the range keeps the empty mock list.
- Back: `router.back()`, else `/main/entrar`.

## Text Content (verbatim)
- Title: `Registro de Depósito`
- Total: `Depósito Total:`
- Empty: `Sem Registros`
- Dates: `Hoje`, `Últimos 3 Dias`, `Últimos 5 Dias`, `Últimos 7 Dias`

## Responsive Behavior
- Mobile (390px): layout above. Lengths in rem so the 486px column cap still tracks.
- Tablet / desktop: same column, not a desktop layout.
