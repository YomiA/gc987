# /security/bind/email — bind new email after login-password verify

Extracted from `https://gc987.com/security/bind/email` at `390x844x3,
mobile, touch`. Reached by a successful Confirmar on
`/security/verify/email`. Local route: `/security/bind/:type` with
`type=email`. Phone bind is not cloned.

Submit is mock — it never posts to gc987.com.

## Shell

Same header as `/security/verify/email`: md elevation-4, toolbar `#154084`,
back `report-back` 16×16, title **ValidaçãoNovoE-mail** (live `ion-title`
textContent; source concatenates `Validação` + `Novo` + `E-mail`).
`ion-content.ion-padding`: `--background #090f1f`, **16px** padding.

## Form (358×168 @(16,66))

| element | geometry | style |
| --- | --- | --- |
| `p.security-bind-email-tips` | 358×20 @(16,66) | 14px/20px/400 white, `margin-bottom: 4px`; copy `Confirmar novo endereço de email` |
| field wrap | 358×50 @(16,96) | `h-[3.125rem]`, margin `10px 0 34px` |
| `ion-input` / `.input-wrapper` | 358×45.95 @(16,96) | height `2.872rem`, `1px solid rgb(26,35,62)`, radius `4px`, pad-left `12px`. No key icon, no eye. |
| native input | 298.7×16.67 @(28.7,110.64) | 14px white, type `text`, placeholder **E-mail** `rgba(255,255,255,.4)`, max 64 |
| clear | 30×30 @(327.3, …), icon 18×18 `#999` | `visibility: hidden` when empty; stays in layout |
| end slot | ~16px | empty flex spacer after the clear |
| `ion-item.submit` host | 278×54 @(56,180) | margin `20px 40px`, filter drop-shadow `rgba(32,139,229,.25) 0 4px 15px` |
| Confirmar | 278×36 @(56,180) | 14px/500 white, gradient `#0167CA → #38A8FA`, radius 10px |

## States

- Empty: no error class.
- Has value and fails live `Gb()` (6–64 chars, one `@`, local/domain rules):
  border `1px solid rgb(230, 64, 33)`, hint **E-mail inválido** 12px/16.8
  `rgb(197,0,15)` with warning SVG `::after`.
- Confirmar with invalid/empty does nothing.
- Length > 64: toast `Por favor, insira no máximo 64 caracteres` (input
  maxlength is 64, so this is a belt check).
- Valid Confirmar (mock): toast **Ligação bem-sucedida**, then replace to
  `/security` after 1s. Email row shows the bound address and no longer
  navigates.

## Interaction model

Click-driven. No scroll-driven restyle.
