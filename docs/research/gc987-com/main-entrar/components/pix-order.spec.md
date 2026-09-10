# PixOrder Specification

## Overview
- **Target file:** `src/components/entrar/PixOrder.vue`
- **Screenshot:** live overlay after Depositar Agora, still `/main/entrar`
- **Interaction model:** click-driven + time-driven countdown

## DOM Structure
`.recharge-qr-code-content` 340px, margin 0 10px inside 15px content pad
- ul.recharge-qr-code-detail (3 tips)
- .qr-area 218px centered
  - amount R$ + 20,00 + copy
  - canvas 150×150
  - .qr-btn Copiar código QR 166×50
  - .qr-code-info 300px
  - countdown
- ul.recharge-order-detail (status / created / order no)

## Computed Styles

### Tips
- margin-top 21px, li 12px/18px/400, margin-bottom 18px, color rgba(255,255,255,.4)
- last li + dotted: rgb(22,128,220)
- dotted 6×6, radius 2px, margin 4px 3px 0 0

### Amount
- 18px/28px/700 #FBA531, flex center
- amount-num margin 0 3px
- copy icon 16×16 #DF8644

### QR button
- 166×50, radius 4px, bg #116fcd, 14px/700 white, line-height 50px

### Info / countdown
- 12px/18px, color rgba(255,255,255,.4); time row .8 white
- minute + ttl margin 0 3px; time icon 16×16

### Order rows
- flex space-between, 12px/18px, margin-bottom 10px
- left rgba(255,255,255,.4); right white; Pendente #FBA531
- copy on order no: 16×16, margin-left 4px

## States & Behaviors
- Copy → toast Cópia Bem-sucedida 2000ms middle
- Countdown 1s tick
- Finalizar (parent header) closes overlay
- Record still goes to /rechargeRecord on live — not cloned

## Assets
entrar-copy.svg, entrar-time.svg, generated mock QR (not the live payment canvas)

## Text Content (verbatim)
See `entrarCopy` in `src/api/entrar.ts`. PIX mask / order no / timestamps are mock.

## Responsive Behavior
Same app column as the form. N/A extra breakpoints.
