# WithdrawTimeFilter

- **Target file:** `src/components/withdraw/WithdrawTimeFilter.vue`
- **Used on:** `/withdrawSubView` Registro de Saques
- **Interaction model:** click

## Trigger
- Hug-width × 32px (`2rem`), padding `0 0.25rem 0 0.5rem`, radius 4px, border `1px solid rgb(109, 120, 141)`
- Label 12px / 700 / 32px white
- Caret 16×16 `rgb(135, 146, 175)`, 180° when open

## Panel (`ion-popover` md)
- Inset 12px from the 390 column (`366×112` at 390), **40px below** the pill (`y=138`)
- Radius 4px, elevation-8, chrome `var(--color-bar-bg)`, row `var(--color-bg-400)`, padding `6px 10px`
- Live `ion-col.select-col`: flex `0 0 25%`, padding 5px, **margin-right 10px**. `.item` is a fixed **90×40** (`white-space: nowrap`), so the fourth chip wraps to row 2.
- Idle: border `1px solid rgb(26, 35, 62)` `rgb(109, 120, 141)` / 400; active: gradient `0deg #0167CA → #38A8FA`, white 700, no border
- Backdrop opacity 0, tap dismisses

## Text
Hoje, Últimos 3 Dias, Últimos 5 Dias, Últimos 7 Dias
