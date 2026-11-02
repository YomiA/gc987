# /rechargeRecord topology (390×844×3, signed in)

Source: `https://gc987.com/main/entrar` → header record icon.
Live pathname: **`/rechargeRecord`**.
Destination: `/rechargeRecord`. No TabBar.

## Shell
- `ion-page.can-go-back` 390×844.
- `ion-header.navigation.md` 50px, `z-index: 10`. Computed `box-shadow: none` (the `navigation` rule uses `--color-bar-bg-shadow`, which resolves empty here).
- `ion-toolbar.ios` 390×50, `--background #101629` (`var(--color-bg-400)`), `--min-height 3.125rem`, `--padding-start/end 4px`.
- Back `ion-button` 42×50 @(4,0), native padding `0 14px`, `ion-icon.back` 14×14 @(18,18). Glyph is `/svg/arrow_left.svg` — same path as `report-back`.
- `ion-title` **Registro de Depósito**, absolute, padding `0 90px`, computed `400 16px/28px` white. Inner `.toolbar-title` 210×28 @(90,11).
- `ion-content.md.ion-padding` 390×794 @(0,50), `--background #090f1f`, padding `1rem`.
- Left SideFab present (global). No bottom tab bar.
- Pull-to-refresh + infinite-scroll present on live; not cloned.

## Flow (top → bottom)
1. Header — back + title.
2. `.top-area.flex-between` 358×32, `margin-bottom: 10px` — date pill **Hoje** + **Depósito Total:** green `0`.
3. Empty state — `/icons/No_record.png` 120×120, `margin-top: 9rem`, label **Sem Registros**.

## Interaction model
Click. Header does not change on scroll.
Date pill opens the same md time popover as `/withdrawSubView` Registro de Saques.
