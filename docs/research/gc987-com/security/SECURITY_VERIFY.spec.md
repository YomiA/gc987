# Validação — first page after Senha de Login / Senha de Ativos

Extracted from the logged-in Chrome DevTools MCP session at `390x844x3,
mobile, touch`. Both jumps reuse one Vue SFC (`data-v-a6fc7d80`) with a
different intro slot. Confirmar must **not** be followed onto the next
live step.

| jump | live URL | local route | intro |
| --- | --- | --- | --- |
| Senha de Login | `/security/verify/password` | same | two lines |
| Senha de Ativos (`não configurado`) | `/security/verify/asset` | same | empty |

## Shell (both)

Same header as `/security`: md elevation-4, toolbar `#154084`, back
`report-back` 16×16 @(16,17), title **Validação** 20px/30px, padding
`0 90px`. `ion-content.ion-padding`: `--background #090f1f`, **16px**
padding (not the 10px of `/security`).

## Login password — `/security/verify/password`

Form 358×187 @(16,66).

| element | geometry | style |
| --- | --- | --- |
| `p.mb-1.text-sm.verify-white-color` | 358×20 @(16,66) | 14px/20px/400 white, `margin-bottom: 4px`; copy `Verificar senha de login` |
| `p.text-[.625rem].verify-minor-color` | 358×15 @(16,90) | 10px/15px `rgb(109,120,141)`; copy `Você pode definir uma nova senha após verificar sua senha de login` |
| field wrap `h-[3.125rem] … mt-[.625rem] mb-[2.125rem]` | 358×50 @(16,115) | margin `10px 0 34px` |
| `ion-input` / `.input-wrapper` | 358×45.95 @(16,115) | height `2.872rem`, `1px solid rgb(26,35,62)`, radius `4px`, pad-left `12px` |
| key icon | 24×24 @(29,125.97) | filled `currentColor`, viewBox 24×25 |
| native input | 241×17 @(57,129.47) | 14px white, type `password`, placeholder **Senha de Login** `rgba(255,255,255,.4)`, min 6 / max 16 |
| clear | 30×30 @(298,122.97), icon 18×18 `#999` | `visibility: hidden` when empty; stays in layout |
| eye | 16×16 @(344,129.97) | wrapper `ml 16px` + `pr-[.8125rem]`; SVG group opacity 0.4 |
| `ion-item.submit` host | 278×54 @(56,199) | margin `20px 40px`, `--min-height: 0`, filter drop-shadow `rgba(32,139,229,.25) 0 4px 15px` |
| submit native | 278×37 @(56,199) | `--background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%)`, radius 10px |
| Confirmar `ion-button` | 278×36 | 14px/500 white, fill clear |

Error slot: warning SVG + `6-16 caracteres`. Shown only while the
field has **1–5** characters (Ionic `ion-invalid` + `has-value`). Empty
and 6–16 hide it. Geometry when visible:

| element | geometry | style |
| --- | --- | --- |
| `.input-bottom` | 358×16.8 @(16,160.95) | padding-left 12px, line-height 1.4 |
| `.error-text` | 88.8×16.8 @(28,160.95) | **12px**/16.8/400 `rgb(197,0,15)`, padding-left 6px, position relative |
| warning `::after` | 16×16 @(16,160.95) | `content: url(warning.svg)`, `left: -12px`, fill `#D74141` |
| invalid input border | 358×45.95 | `1px solid rgb(230, 64, 33)` |

Confirmar does not move when the hint is open (still @(56,199)).

## Asset password — `/security/verify/asset`

Same field + Confirmar. First form `div` is empty (height 0). Field wrap
starts @(16,76). Submit host @(56,160). Placeholder is still **Senha de
Login** (verifying login before setting the asset password).

## Not cloned

Any page after a successful Confirmar on either route.
