# /main/withdraw topology (390×844×3, signed in)

Source: `https://gc987.com/main/withdraw` after TabBar **Saque**. Destination: `/main/withdraw`.

Do not query a generic `.ion-page` on the live site — other Saque-titled hosts exist. Use `.ion-page.can-go-back`.

## Shell
- `ion-page.can-go-back` 390×844, `z-index: 101`.
- `ion-header.md.ion-no-border` 50px (`3.125rem`), toolbar `--background #154084`.
- `ion-content.md.ion-padding`: `--background #090f1f`, padding `16px 16px 72px` (`1rem` / `--padding-bottom: calc(56px + 1rem)`).
- Shared TabBar, **Saque** active (not the raised Depósito hump). Bar 56px at y=789.
- `can-go-back` is true after Inicio → Saque, but **no back button** is in the tree. Do not render one.

## Flow (top → bottom)
1. Header — title **Saque**, record / list icon on the right (live → `/withdrawRecord`, not cloned this round).
2. Balance `.balance-area` — **Conta Saldo** + **R$** + amount (`0,00` on the captured session).
3. Channel `.channel-wrap.main-tab` — one **PIX** pill, already `.active`.
4. 1px `--color-line` / `rgb(26, 35, 62)` rule, `margin-top: 10px`.
5. `h6` **Valor do Saque**.
6. 3×3 amount chips (cents). All `.disabled` while balance is `0,00`.
7. Fee row `h6.tips` — **hidden until** the amount input exceeds Conta Saldo. Then help icon + **para saques {balance} Taxa de Manuseio**, and the input snaps to that balance.
8. Amount `.item-row` — number input, placeholder `10,00 - 10.000,00`, no visible R$ prefix.
9. Empty `h6.text-[.625rem]` (height 0) — do not render. Second 1px line.
10. `.channel-wrap.sub-tab` — **Método de Retirada** + **CPF** pill `.active`.
11. `.form-wrap` — **Nome**, **CPF ID**.
12. **Retirar Agora** `ion-item.submit` 280×40.

## Interaction model
Click / type. Not scroll-driven. Chips are `pointer-events: none` while `.disabled`. Confirm / hint modals (`#confirmModalWithdraw`, `.withdrawHint`) stay `overlay-hidden` on empty/zero-balance submit — not cloned this round.

## Responsive
- **Mobile (390px):** reference. Root 16px, `1rem = 16px`.
- **Tablet (768) / desktop (1440):** same rem column (max 486px). Do not implement a desktop layout.
