# WithdrawSubView specification

## Overview
- **Target file:** `src/views/WithdrawSubViewPage.vue`
- **Screenshot:** live `/withdrawSubView` at 390
- **Interaction model:** click

## Computed (390, 1rem = 16px)

### Header
- 390×50, shadow elevation-4, toolbar `#154084`, padding 4px
- Back 38×22, icon 16×16 white, same path as `report-back`
- Segment 340×50, justify left; buttons min-width 90px, padding 0 8px
- Indicator 2px gradient `0deg #0167CA → #38A8FA`

### Saques body
- content padding 16px, bg `#090f1f`
- time pill + total as BEHAVIORS.md
- empty image `/images/promo-page/no-record.png` 120×120, label **Sem Registros** 16px / 24px `rgb(99, 100, 105)` on saques; 14px / 20px on auditoria

### Auditoria body
- header / select as BEHAVIORS.md

## Text (verbatim)
Registro de Saques, Registros de Auditoria, Hoje, Últimos 3 Dias, Últimos 5 Dias, Últimos 7 Dias, Retirada Total:, Valor a ser auditado:, Todos, Depósito de Membro, Eventos, Auditoria do Sistema, Sem Registros
