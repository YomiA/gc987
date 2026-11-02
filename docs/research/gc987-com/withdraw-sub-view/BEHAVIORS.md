# /withdrawSubView behaviors (390×844×3)

INTERACTION MODEL: click.

## Header tabs
- Host `ion-segment-button` `--indicator-color #38a8fa`, `--indicator-height 2px`.
- Indicator fill `linear-gradient(0deg, #0167CA 0%, #38A8FA 100%)`.
- Label 12.48px / 400 / 22px. Selected `#fff`, unselected `rgb(109, 120, 141)`.
- Back uses the same chevron as `/user/report` (`report-back`).

## Registro de Saques
- `.top-area.flex-between` 358×32, `margin-bottom: 10px`.
- Time pill `#time-popover-button` hug-width × 32, padding `0 4px 0 8px`, radius 4px (`--rounded-small` override `.25rem` on live `#app`), border `1px solid rgb(109, 120, 141)`.
- **Hoje** 12px / 700 / 32px white; caret 16×16 `rgb(135, 146, 175)`.
- Popover 366×112 @(12,138), radius 4px, md elevation-8, row bg `rgb(16, 22, 41)`, padding `6px 10px`.
- Options (this tenant): Hoje, Últimos 3 Dias, Últimos 5 Dias, Últimos 7 Dias. 90×40, radius 6px. Active: gradient `0deg #0167CA → #38A8FA`, white 700, no border.
- **Retirada Total:** 12px / 700 white + amount `rgb(39, 212, 139)` / live `--color-success #27D48B`.
- Empty `.empty` 358×288; image `margin-top: 9rem`.

## Registros de Auditoria
- `.header` 358×36, `margin-bottom: 10px`, space-between.
- **Valor a ser auditado:** 14px / 400 / 14px white + `0,00` `rgb(251, 165, 49)`.
- `.select-box` 150×36, padding 7px, bg `rgb(16, 22, 41)`, radius 4px, border `1px solid rgb(26, 35, 62)`.
- Options: Todos, Depósito de Membro, Eventos, Auditoria do Sistema.
- Panel 150×144 under the field; active row white 700 on `rgb(25, 30, 45)`; idle `rgba(255,255,255,.4)` / 500.
- Empty image `margin-top: 8.5rem`; label 14px / 20px `rgb(99, 100, 105)`.

## Out of scope
- Pull-to-refresh, row list (live account empty), `/withdrawAuditDetails`.
