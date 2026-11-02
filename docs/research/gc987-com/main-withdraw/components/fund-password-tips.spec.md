# Fund-password TIPS popup

## Overview
- **Target file:** `src/components/withdraw/FundPasswordTips.vue`
- **Trigger:** first **Retirar Agora** while mock `isAssetPassword === false`
- **Interaction model:** click. `backdropDismiss: false`.

## Live logic (index bundle)
```
passwordSwitch is ON (or unset) && !isAssetPassword
  → Nt({ type: TIPS, msg: popup.tips06, leftBtnCallback })
  → /security/verify/asset  (this tenant; NONE would be /withdrawPW)
```

## Copy (locale `popup.tips06`)
Para a segurança dos seus fundos, por favor, configure primeiro uma senha de fundo

Left button default: **Confirmar** (`main.confirm`).

## Computed / declared (Popup/first)
- Overlay covers the column, flex center
- `.main-bg` 21.25rem wide, min-height 13.75rem, radius 1.125rem, `margin-top: 4.375rem`
- Content 16.25rem, 14px / 1.5, center, `rgba(255,255,255,.6)`
- Button 9.375rem, gradient `0deg #0167CA → #38A8FA`, white
- `backdropDismiss: false`

Mock: `withdrawApi.getAssets()` → `{ passwordSwitch: 'ON', isAssetPassword: false }`.
