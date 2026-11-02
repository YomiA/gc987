# /withdrawSubView topology (390×844×3, signed in)

Source: `https://gc987.com/main/withdraw` → header record icon.
Live pathname: **`/withdrawSubView`** (not `/withdrawRecord`).
Destination: `/withdrawSubView`. No TabBar.

## Shell
- `ion-page.can-go-back` 390×844, `z-index: 101`.
- `ion-header.md` 50px, elevation-4, toolbar `--background #154084`.
- Back `ion-button` 38×22 @(6,14) + `ion-segment` 340×50 @(46,0) with two tabs.
- `div.bottom` → `ion-content.ion-padding` 390×794, `--background #090f1f`, padding `1rem`.
- No bottom tab bar. Pull-to-refresh present on live; not cloned.

## Tabs (click)
1. **Registro de Saques** (default) — date pill **Hoje** + **Retirada Total:** green `0`.
2. **Registros de Auditoria** — **Valor a ser auditado:** orange `0,00` + **Todos** select.

Both empty states: `/icons/No_record.png` + **Sem Registros**.

## Interaction model
Click. Header does not change on scroll.
