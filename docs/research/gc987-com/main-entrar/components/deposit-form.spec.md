# DepositForm Specification

## Overview
- **Target file:** `src/components/entrar/DepositForm.vue`
- **Screenshot:** live `/main/entrar` at 390
- **Interaction model:** click-driven

## DOM Structure
segment → pix channel → `.line` → `.desc-text` → money input → chip grid → submit

## Computed Styles (getComputedStyle, 390)

### Segment `.tab-list`
- height: 49px, margin-top: 10px, border-bottom: 1px solid rgb(26, 35, 62)
- checked button: 132.54×48, 14px/400 white
- RECO: 8px, absolute top 4px right 2px, padding 0 2px 2px, radius 4px, bg #E64021
- indicator: 1px, gradient 0deg #0167CA → #38A8FA

### pix `.item.active`
- 110×40, margin-top 15px, radius 6px, line-height 40px, text-align center
- background: linear-gradient(0deg, #0167CA 0%, #38A8FA 100%), color white, font-size 16px
- tag: absolute top -6px right 0, height/lh 15px, padding 0 3px, 8px italic RECO, bg #E64021

### Promo `.desc-text`
- 14px / 21px / 400, white, white-space: pre-line, width 360

### Input `ion-input.money-input`
- 360×50, margin 18px 0, radius 6px, --background #101629
- wrapper padding 0 10px, prefix R$ 14px rgb(135,146,175), margin-end 5px
- native type number, placeholder `10 - 50.000`, 14px white
- clear 30×30, color rgb(153,153,153), visible when filled

### Chips
- flex wrap, gap 10px, margin-bottom 10px
- each: flex 0 0 calc(33.333% - 0.416667rem), 113.3×40, radius 6px
- default bg rgb(26,34,58), amount 16px/500 rgb(109,120,141)
- active: gradient 90deg #202940→#131a2c, border 1px solid #38a8fa, amount white

### Submit
- 280×40, margin 20px auto 0, radius 10px
- gradient 0deg #0167CA → #38A8FA, 16px/500 white
- filter drop-shadow(rgba(32,139,229,0.25) 0 4px 15px)
- disabled opacity 0.5 pointer-events none

## States & Behaviors
Chip click → fill input, enable submit. Clear → empty. Submit → PIX overlay (parent).

## Assets
entrar-record.svg (header, parent), register-clear.svg

## Text Content (verbatim)
Depósito on-line, RECO, pix, promo paragraph, R$, 10 - 50.000, chip labels via formatAmount, Depositar Agora

## Responsive Behavior
- **Desktop (1440px):** same rem column (max 486px)
- **Tablet (768px):** same
- **Mobile (390px):** reference
- **Breakpoint:** N/A (app column)
