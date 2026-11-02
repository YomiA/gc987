# /withdraw/apply — Saque without TabBar

Extracted from `https://gc987.com/withdraw/apply` at `390x844x3`. Live
route meta `{ auth: true, hasBottomTab: false }`.

Same PIX / amount / CPF form as `/main/withdraw`. Header is back +
`Saque` (text-lg) + record icon. No TabBar.

Local `/main/withdraw` Retirar Agora, after the fund-password TIPS path
is skipped, pushes this route. PIX chip pushes `/withdrawalAccount`.
Submit on this page is mock — never posts to gc987.com.

## Shell

Toolbar `#154084`, 50px. Back 38×22. Record icon same as `/main/withdraw`.
Content pad 16px, bg `#090f1f`, 794 tall (no tab-bar spacer).
