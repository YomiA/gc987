# /rechargeRecord behaviors (390×844×3)

INTERACTION MODEL: click.

## Entry
- `/main/entrar` header record `ion-button` (no `href`) pushes **`/rechargeRecord`**.
- Back returns to the previous page (deposit).

## Date pill
- Same control as `/withdrawSubView` `#time-popover-button` (`data-v-90f59315`).
- Closed: hug-width × 32, padding `0 4px 0 8px`, radius 4px, border `1px solid rgb(109, 120, 141)`.
- **Hoje** 12px / 700 / 32px white; caret 16×16 `rgb(135, 146, 175)`, `transition: transform 0.1s linear`.
- Open: caret `rotate(180deg)`. Popover 366×112 @(12,138) = pill bottom + 40px, inset 12px, radius 4px, md elevation-8, chrome `#090f1f`, row `#101629` padding `6px 10px`.
- Options: Hoje, Últimos 3 Dias, Últimos 5 Dias, Últimos 7 Dias. Chip 90×40, radius 6px. Active: gradient `0deg #0167CA → #38A8FA`, white 700, no border. Idle: `rgb(109, 120, 141)` / 400, border `1px solid rgb(26, 35, 62)`.
- Backdrop computed opacity 0.32 with `background: transparent` — no visible dim. Tap outside dismisses.
- Transform origin right edge (`366px 0`).

## Total
- **Depósito Total:** 12px / 700 / 18px white + amount `rgb(39, 212, 139)` (`#27d48b`). Live class is `.amount-display.currency` but this skin paints `--color-success`, not `--color-currency`.
- Live `pay.recordList` returned `{ recordList: [], total: 0, totalAmount: null }`; the UI prints `0`.

## Empty
- Wrap 358×288, column, centered. Image 120×120, `margin-top: 9rem`. Label 16px / 24px `rgb(99, 100, 105)`.

## Out of scope
- Pull-to-refresh, infinite scroll, row list (live account empty), real `pay.recordList`.
