# Withdraw header specification

## Overview
- **Target file:** `src/views/WithdrawPage.vue` (header block)
- **Screenshot:** live `/main/withdraw` at 390
- **Interaction model:** click (record is a no-op this round)

## DOM Structure
`ion-header.md.ion-no-border` → `ion-toolbar` (ios, `--background #154084`, `--min-height 3.125rem`, padding 4px) → `ion-title.text-lg` **Saque** + `ion-buttons[slot=primary]` record icon.

No `ion-back-button` even when `can-go-back` is set.

## Computed Styles (getComputedStyle, 390)
- Header / toolbar: 390×50, background `#154084`
- Title: 18px / 400 / 28px, white, `padding: 0 90px` (`5.625rem`), centered, `pointer-events: none`
- Record host: ~42×38 at the right slot; icon 28×20, white, viewBox `0 0 18 22` — reuse `entrar-record`

## States & Behaviors
Record click on live pushes `/withdrawRecord`. Clone: button present, no route.

## Assets
`src/assets/icons/entrar-record.svg`

## Text Content (verbatim)
Saque

## Responsive Behavior
- **Desktop (1440px):** same rem column
- **Tablet (768px):** same
- **Mobile (390px):** reference
- **Breakpoint:** N/A (app column)
