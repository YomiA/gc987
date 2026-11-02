# /withdrawalAccount + /withdrawalBindAccount

Extracted at `390x844x3`.

## /withdrawalAccount — Minha conta

Toolbar `#101629`, title inner 16px/400/28 `Minha conta`, header shadow
`0 4px 28.4px rgba(0,0,0,.1)`. Content bg `#090f1f`.

PIX segment 354×44, margin `24px 18px 35px`. Checked button 344×40, bg
`#101629`, radius 4, label 14px/700 white.

`Adicionar Conta` row 366×60, margin `0 12px 12px`, pad 10, bg `#101629`,
radius 6. Label 12px/18 `#116fcd`.

Empty PIX list on the captured session. Add pushes `/withdrawalBindAccount`.

## /withdrawalBindAccount — Adicionar Conta

Toolbar `#154084`, title `Adicionar Conta`. Content pad `0 1.125rem`.
Same PIX tab.

Tips: (1) 12px/18 `#e64021`; (2) `rgba(255,255,255,.4)`, margin `13px 0 21px`.

Fields: label 16px/18 `rgba(255,255,255,.8)`. Input 366×45.95, bg
`#1a1d22`, radius 4, 14px/700. PIX has `+55` prefix.

Footer fixed 388×70, button 366×46 @(12,774), radius 4, gradient
`linear-gradient(0deg, rgb(11,56,104) -13.77%, rgb(27,76,118) 102.34%)`.
Disabled text `rgba(255,255,255,.4)` until name + PIX are filled.

Submit is mock: stores the PIX locally and returns to Minha conta.
