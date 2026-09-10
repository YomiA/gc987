# /main/entrar behaviors (390×844×3)

INTERACTION MODEL: click/type. Scroll does not change header or tabs.

## Amount chips
- Click fills the number input with integer reais (`20` for 20,00) and enables submit.
- Selected chip: background `linear-gradient(90deg, #202940 0%, #131a2c 100%)`, border `1px solid #38a8fa`, amount white 16px/500.
- Default chip: `rgb(26, 34, 58)`, amount `rgb(109, 120, 141)` 16px/500.
- Clear (30×30, `rgb(153,153,153)`) empties the input and disables submit. Hidden when empty (`visibility: hidden` on live).

## Submit
- Disabled: `opacity: 0.5; pointer-events: none` until value in 10–50000.
- Enabled: drop-shadow `0 4px 15px rgba(32,139,229,.25)`, gradient `0deg #0167CA → #38A8FA`.
- Click opens PIX overlay **on `/main/entrar`** (not a new route).

## Record
- Header document icon → live navigates to `https://gc987.com/rechargeRecord`. **Not cloned this round.**

## PIX overlay
- **Finalizar** pops back to the form (amount kept).
- **Copiar código QR** / copy icons → toast `Cópia Bem-sucedida`, duration 2000, position middle.
- Countdown ticks every second from ~24h (`23h 59m 53s` on first paint).
- TabBar still present; Inicio / Promoção / Perfil leave the overlay via route push.

## Out of scope this round
- `/rechargeRecord`
- Saque
- Real PIX / order APIs (mock only)
- 0% gift-bonus banner (live `display:none`)
