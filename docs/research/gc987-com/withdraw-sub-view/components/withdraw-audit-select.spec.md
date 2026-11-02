# WithdrawAuditSelect

- **Target file:** `src/components/withdraw/WithdrawAuditSelect.vue`
- **Used on:** `/withdrawSubView` Registros de Auditoria
- **Interaction model:** click

## Field `.select-box`
- 150×36 (`2.25rem`), padding 7px (`0.4375rem`), radius 4px
- Background `var(--color-bg-400)`, border `1px solid rgb(26, 35, 62)`
- Label 14px / 400 white; chevron 16×16 white, 180° when open

## Panel `ul.select-list`
- 150×144, same left/width as the field, directly under it
- Rows 36px, 12px / 500, center, idle `rgba(255,255,255,.4)`
- Active: white 700, `rgb(25, 30, 45)`
- Backdrop opacity 0, tap dismisses

## Text
Todos, Depósito de Membro, Eventos, Auditoria do Sistema
