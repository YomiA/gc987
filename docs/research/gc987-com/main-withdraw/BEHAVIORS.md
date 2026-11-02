# /main/withdraw behaviors (390×844×3)

INTERACTION MODEL: click / type. Scroll does not change header or tabs.

## Balance
- Label **Conta Saldo** 14px / 700 / 21px, white.
- **R$** + amount 14px / 700, `rgb(251, 165, 49)` / `--color-currency`. R$ `margin-left: 8px`, amount `margin-left: 3px` (no space character).
- Captured session: `0,00`. Mock stays at 0 cents so chips match live.

## PIX / CPF
- Single PIX pill, always active. Gradient `0deg #0167CA → #38A8FA`, 112×42 (`7rem × 2.625rem`), 14px / 400 / 42px, white, radius 6px, border `0.0625rem solid rgb(26, 35, 62)`.
- **Método de Retirada** 16px / 400 / 22px, white, `margin: 12px 0`.
- CPF pill 80×34 (`5rem × 2.125rem`), 14px / 700, color stays `rgb(109, 120, 141)` when `.active`. Active fill `linear-gradient(90deg, #202940 0%, #131a2c 100%)`, border `rgb(22, 128, 220)` / `--theme-color-500`.

## Amount chips
- Flex wrap, `gap: 12px` (`0.75rem`), `padding-bottom: 10px`, `justify-content: space-between`.
- Each: `flex: 0 0 calc(33.333% - 0.5rem)`, 40px / `2.5rem`, radius 6px.
- Idle: `background rgb(26, 34, 58)`, amount 16px / 400 / 40px `rgb(109, 120, 141)`.
- `.disabled { pointer-events: none }` — live applies this when the chip exceeds Conta Saldo.
- `.active` (blue-default CSS): `background: var(--theme-color-gradient-300)`, white, 700, `border: 1px solid var(--theme-color-600)` (`#38a8fa`).
- Cents: 2000, 5000, 10000, 100000, 500000, 1000000, 2000000, 3000000, 5000000.
- Labels via `formatAmount`: `20,00` … `50.000,00`.

## Amount input
- Host `.item-row`: 358×40, `background rgb(16, 22, 41)`, radius 6px, `padding-left: 8px`, `margin-bottom: 21px` (`1.3125rem`).
- `type=number`, placeholder **`10,00 - 10.000,00`**, 14px white, placeholder white / opacity 0.6.
- Empty 20px left label slot (no R$ text).
- Clear 30×30, `rgb(153, 153, 153)`, `register-clear.svg`, hidden when empty.
- Hidden error **`Por favor insira um valor inteiro`**, 10px / 15px `rgb(197, 0, 15)`. Range 10–10.000 reais.

## Fee row
- Hidden by default. Appears only while typing an amount **greater than Conta Saldo** (the figure above the PIX pill).
- On that keystroke the input is clamped to the balance (`0` when the captured session is `R$ 0,00`) and the row stays visible until the field is cleared or a value ≤ balance is typed.
- `h6.tips` 12px / 500 / 16px, `margin: 0 0 10px`, flex, `rgb(109, 120, 141)` on the host.
- Help icon 16×16, `rgb(22, 128, 220)`, `margin-right: 2px`.
- Span **para saques {formatAmount(balance)} Taxa de Manuseio**, `rgb(22, 128, 220)` / `--color-text-href`.
- Click did not open `.withdrawHint` (stayed `overlay-hidden`). Icon is visual only this round.

## PIX / CPF lists
- `overflow-x: auto; overflow-y: hidden` with the scrollbar painted none. A 1px `scrollHeight` excess plus `overflow-x: auto` otherwise promotes `overflow-y: auto` and draws a Windows scrollbar beside the pill.

## Nome / CPF
- Form `margin-top: 21px`. Each `.item` `margin-bottom: 30px` (`1.875rem`).
- Label 12px / 400 / 22px, white.
- Input 358×44, 14px / 700, white. Underline via `.input-bottom` `border-top: 0.67px solid rgb(26, 35, 62)`. Focus highlight 2px `#38a8fa`, `transform: scale(0→1)`, 200ms.
- Nome placeholder **`Por favor, insira seu nome`**, maxlength 128. Error **`Nome inválido`** 10px `rgb(230, 64, 33)`.
- CPF ID `type=tel`, min/max 11, placeholder **`Por favor, insira o CPF`**. Error **`CPF inválido, por favor insira 11 dígitos`**.
- Placeholders `--placeholder-color: #6D788D` with opacity 0.6.

## Submit
- 280×40, `margin: 20px auto 0`, radius 10px.
- Gradient `0deg #0167CA → #38A8FA`, 16px / 500 white, `filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 4px 15px)`.
- Live empty-form button was **not** `disabled`. `.btn-disabled { opacity: 0.5; pointer-events: none }` exists in CSS but was not applied.
- Click with empty / zero-balance fields did not present `#confirmModalWithdraw`. Submit validates locally; no PIX payout.

## Record
- Header document icon (same SVG as `entrar-record.svg`) → live `/withdrawSubView`.

## Out of scope this round
- Confirm / hint / insufficient-balance overlays
- Real withdraw / CPF / assets APIs (mock `getAssets` only)
- Wiring ProfileCard Saque (TabBar only)
