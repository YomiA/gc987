# /security — "Centro de Segurança" (Perfil → Centro de Segurança)

Extracted from `https://gc987.com/security` in the logged-in Chrome
DevTools MCP session, emulating `390x844x3, mobile, touch`. Reached by
tapping **Centro de Segurança** on `/main/perfil` — a route push (z-index
101 over the stacked perfil page), not an overlay. Local route: `/security`.

No bottom tab bar on this route. Body background `#090f1f`.

## Shell

| element | geometry | style |
| --- | --- | --- |
| `ion-page` | 390×844, `z-index: 101` | column, `can-go-back` |
| `ion-header.md` | 390×50 | `z-index: 10`, **md elevation-4** (same shadow as `/user/report`) |
| `ion-toolbar` (ios) | 390×50 | `--background: #154084`, `--min-height: 3.125rem`, `--padding-start/end: 4px` |
| back `ion-button` | 38×22 @(6,14), glyph 16×16 @(16,17) | same custom chevron as `/user/report` (`report-back`) |
| `ion-title` (ios) | absolute over the toolbar, `padding: 0 90px` | 20px/30px, centred; text `Centro de Segurança` |
| `ion-content` | 390×794 @(0,50) | `--background: #090f1f`, `--padding: .625rem` on all four sides |

## Cards — `.security-item`

Two blocks, `width: 100%`, `padding: 0 10px`, `border-radius: 8px`,
`margin-bottom: 10px`, background the page's `--color-bg-200` override
`#101629` (`rgb(16, 22, 41)`).

| card | geometry |
| --- | --- |
| account / phone / email | 370×144 @(10,60) |
| login / asset password | 370×96 @(10,214) |

## Rows — `ion-item`

`--min-height: 48px`, `--padding-start: 0`, `--inner-padding-end: .25rem`,
`--background: transparent`, `font-size: .75rem` / `line-height: 1rem`.
Start icon `width: 1.5rem`, `margin: 0 10px`, paints **24×18**. Left
label white; right `ion-label.security-item-right-color` is
`#9BA7BE` / `rgb(155, 167, 190)` with `margin-left: 16px`.

`item-lines-inset` hairline is `1px solid var(--divider)`
(`rgb(26, 35, 62)`) on the full 350-wide inner (`--padding-start` is 0,
so the line is inset only by the card's 10px padding). Last row of each
card is `item-lines-none`.

| row | y | lined | detail | right copy (this account) |
| --- | --- | --- | --- | --- |
| Conta | 60 | yes | no | mock account (same digit count as perfil) |
| Telefone | 108 | yes | no | same mock account |
| E-mail | 156 | no | no | `Desvincular` |
| Senha de Login | 214 | yes | yes | `Já definido` |
| Senha de Ativos | 262 | no | yes | `não configurado` |

Detail chevron (password rows only): Ionic `chevron-forward`, 15×15
@(357, …), `opacity: 0.25`, white, `margin: 2px -6px 0 2px`.

## Not cloned

- Pages after Confirmar on `/security/verify/password` and
  `/security/verify/asset`. First pages: `SECURITY_VERIFY.spec.md`.
- **E-mail** sub-flow.
- The site-wide 30×30 floating ball.
