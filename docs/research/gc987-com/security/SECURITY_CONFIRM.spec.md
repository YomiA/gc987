# /security/confirm/password — change login password after Validação

Extracted from `https://gc987.com/security/confirm/password` at
`390x844x3, mobile, touch`. Reached by a successful Confirmar on
`/security/verify/password`. Local route: `/security/confirm/:type` with
`type=password`. Asset PIN confirm uses the same route with `type=asset`.

Submit is mock — it never posts to gc987.com and must not be followed on
the live account.

The painted login-password UI is two `ion-item.password` bars, not the Ot
verify field. `.error-text` stays `display: none` even when `ion-invalid`.

## Shell

Same header as `/security`: md elevation-4, toolbar `#154084`, back
`report-back` 16×16, title **Alterar Senha** 20px/30px/400, padding
`0 90px`. `ion-content` inner-scroll padding `0`; the form inset is the
page’s **16px** padding. Page background `#090f1f`.

## Form (358×232 @(16,66))

| element | geometry | style |
| --- | --- | --- |
| `p.confirm-white-color` | 358×20 @(16,66) | 14px/20px/400 white, no extra margin under the 20px box; copy `Confirmar nova senha` |
| first `ion-item.password` | 358×59 @(16,96) | margin `10px 0 5px`, `--min-height: 54`, `--inner-padding-end: .25rem`, `--background: transparent`, `item-lines-none` |
| first `.input-wrapper` | 354×54 @(16,96) | pad `0 16px`, radius 10px, bg `rgb(16,22,41)`, no border |
| first native | 322×16.67 @(32,114.67) | 14px white, type `password`, placeholder **Senha** `rgb(155,167,190)` / opacity 0.6 |
| first eye | 20×20 @(336,114) | `position: absolute; top: 18px; right: 18px`, `rgb(109,120,141)`, opacity 1. No key icon, no clear |
| second `ion-item.password` | 358×59 @(16,165) | same bar as the first |
| second native | 322×16.67 @(32,183.67) | placeholder **Confirmar senha** |
| second eye | 20×20 @(336,183) | same as the first eye |
| `ion-item.submit` host | 278×54 @(56,244) | margin `20px 40px`, filter drop-shadow `rgba(32,139,229,.25) 0 4px 15px`, overflow hidden |
| Confirmar `ion-button` | 278×36 @(56,244) | 14px/14px/**700** white, pad `8px 15.4px`, gradient `0deg #0167CA → #38A8FA`, **radius 4px** (not the verify page’s 10px/500) |

Validator is live `Qd()`: length 6–16 and no whitespace. Native
`maxLength` is `-1` on this page; clone still caps at 16.

## States

- Empty or 1–5 chars / whitespace: `ion-invalid` may be set, but
  `.error-text` (**6-16 caracteres**, 10px/15px `rgb(197,0,15)`) is
  `display: none` / 0×0. Confirmar stays @(56,244). No wrap border
  change. Submit does nothing.
- Both fields 6–16 and unequal: toast **As senhas inseridas duas vezes
  não correspondem**.
- Both fields 6–16 and equal (mock): toast **Modificação bem-sucedida**,
  then replace `/security` after 1s. Do not call the live
  change-password API.

## Asset PIN — `/security/confirm/asset`

Painted from `https://gc987.com/security/confirm/asset` at `390x844x3`.
Reached by Confirmar on `/security/verify/asset`. No submit button: the
second 6-digit grid fires when it is full. Do **not** complete matching
PINs on the live account.

| element | geometry | style |
| --- | --- | --- |
| title **Saque Senha** | 390×50, pad `0 90px` | `$t('label.asset')`, 20px/30px/400, toolbar `#154084` |
| heading `confirm-white-color` | 358×20 @(16,66) | 14px/20px/400 white, `margin-bottom: 4px`; copy **ConfigurarSenha de Ativos** (`main.set` + `label.assetsPassword`, no space) |
| `.fundPassword` | 358×154.67 @(16,90) | `padding-bottom: 16px` |
| first label | 358×20 @(16,90) | 14px/20px `rgb(109,120,141)`; **EntrarNova senha de financiamento** |
| first `.grid-password` | 358×45.33 @(16,114) | flex, `space-between`, 1px transparent border |
| first cells | 44×44, x 16.67 / 79.2 / 141.73 / 204.27 / 266.8 / 329.33, y 114.67 | bg `#1a223a`, radius 4px |
| first hidden input | 356.67×44 overlay | `inputmode=numeric`, `maxlength=6`, opacity 0 |
| second label | 358×20 @(16,159.33) | **ConfirmarNova senha de financiamento** |
| second grid | 358×45.33 @(16,183.33) | same cells at y 184 |

Filled cell: 10×10 white disc `.dot`. Next empty while focused: 1×16
cursor, blink 1s (opaque 0–49%, hidden 50–100%), cell border `1px solid
#0167CA`. First grid autofocuses after 500ms. Digits only.

## Asset states

- Second grid reaches 6 digits and first is missing/unequal: toast **As
  senhas inseridas duas vezes não correspondem**. No API.
- Both 6 digits and equal (mock): toast **Configurado com sucesso**, then
  replace `/security` after 1s. Senha de Ativos becomes **Já definido**.
  Withdraw TIPS no longer opens. Do not call the live set-asset API.

## Not cloned

- `/withdrawPW` / `/withdrawPWCompletion` (other tenant auth method).
