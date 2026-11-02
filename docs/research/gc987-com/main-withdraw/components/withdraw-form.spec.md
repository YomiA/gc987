# WithdrawForm specification

## Overview
- **Target file:** `src/components/withdraw/WithdrawForm.vue`
- **Screenshot:** live `/main/withdraw` at 390
- **Interaction model:** click / type

## DOM Structure
balance → PIX list → line → Valor do Saque → chips → (fee tips if over balance) → amount row → line → Método de Retirada → CPF → Nome / CPF ID → Retirar Agora

## Computed Styles (getComputedStyle, 390)

### Balance `.balance-area`
- 358×21, `margin: 8px 0`
- `.account`: 14px / 700 / 21px, white
- `.balance-w`: 14px / 700, `rgb(251, 165, 49)`, `margin-left: 8px`
- `.amount`: `margin-left: 3px`, same orange

### PIX `.channel-wrap.main-tab li.active`
- 112×42, radius 6px, padding `0 12px`, `margin-right: 12px`
- 14px / 400 / 42px, white, text-align center
- `linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%)`
- border `0.666667px solid rgb(26, 35, 62)`

### Line
- 358×1, `background rgb(26, 35, 62)`, `margin-top: 10px`

### `h6` Valor do Saque
- 14px / 500 / 20px, white, `margin: 6px 0 10px`

### Chips `.amount-list.flex-between`
- flex wrap, gap 12px, padding-bottom 10px, space-between
- item `flex: 0 0 calc(33.333% - 0.5rem)`, 111.3×40, radius 6px
- idle bg `rgb(26, 34, 58)`, 16px / 400 / 40px `rgb(109, 120, 141)`
- disabled: `pointer-events: none`
- active CSS: gradient 90deg `#202940 → #131a2c`, white, 700, border `1px solid #38a8fa`

### Fee `h6.tips`
- Not in the default tree. `v-if` after the typed amount exceeds Conta Saldo.
- 12px / 500 / 16px, flex, `margin: 0 0 10px`
- icon 16×16 `rgb(22, 128, 220)`, `margin-right: 2px`
- span `rgb(22, 128, 220)` — **para saques {formatAmount(balance)} Taxa de Manuseio**

### Amount `.item-row`
- 358×40, bg `rgb(16, 22, 41)`, radius 6px, `padding-left: 8px`, `margin-bottom: 21px`
- 20px empty left slot; native 14px / 400 white
- placeholder `10,00 - 10.000,00`, white opacity 0.6
- clear 30×30 `rgb(153, 153, 153)`
- error 10px `rgb(197, 0, 15)` `display: none` until invalid

### Sub-tab
- title 16px / 400 / 22px white, `margin: 12px 0`
- CPF 80×34, 14px / 700 `rgb(109, 120, 141)`, gradient 90deg `#202940 → #131a2c`, border `rgb(22, 128, 220)`

### Form `.form-wrap`
- `margin-top: 21px`, overflow hidden
- `.item` `margin-bottom: 30px`
- label 12px / 22px white
- input 358×44, 14px / 700
- `.input-bottom` `border-top: 0.666667px solid rgb(26, 35, 62)`, padding-top 5px
- highlight 2px `#38a8fa`, scale 0, 200ms; scale 1 when focused
- errors 10px / 15px `rgb(230, 64, 33)`

### Submit `ion-item.submit`
- 280×40, `margin: 20px auto 0`, radius 10px
- `--background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%)`
- 16px / 500 white, `filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 4px 15px)`
- not disabled on the captured empty form

## States & Behaviors
Chips no-op while amount > balance. Typing an amount above Conta Saldo shows the blue fee row and clamps the input to that balance. Clear empties the field and hides the row. Submit shows the three hidden error strings when Nome / CPF / amount fail; does not open a payout overlay.

## Assets
`withdraw-help.svg`, `register-clear.svg`

## Text Content (verbatim)
Conta Saldo, R$, PIX, Valor do Saque, chip labels, para saques 0,00 Taxa de Manuseio, 10,00 - 10.000,00, Método de Retirada, CPF, Nome, Por favor, insira seu nome, Nome inválido, CPF ID, Por favor, insira o CPF, CPF inválido, por favor insira 11 dígitos, Por favor insira um valor inteiro, Retirar Agora

## Responsive Behavior
- **Desktop (1440px):** same rem column
- **Tablet (768px):** same
- **Mobile (390px):** reference
- **Breakpoint:** N/A (app column)
