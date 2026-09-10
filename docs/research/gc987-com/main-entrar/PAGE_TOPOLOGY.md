# /main/entrar topology (390×844×3, signed in)

Source: `https://gc987.com/main/entrar` after login. Destination: `/main/entrar`.

## Shell
- `ion-page` column, `ion-header` z-index 10, `ion-content.recharge-content` scroller, shared TabBar (Depósito raised, `active=deposito`).
- Form header 50px, `--background #154084`. PIX overlay header 60.7px because `ion-button.finish` is 52.7 + 4px margin.
- Content padding `0 15px 72px`, `--background #090f1f`.

## Flow (top → bottom)
1. Header — title **Depósito**, record icon (live → `/rechargeRecord`, not cloned this round). Overlay adds **Finalizar**.
2. Segment — one checked tab **Depósito on-line** + RECO, 1px gradient indicator.
3. Channel row — **pix** + RECO, gradient pill 110×40. Empty sibling `li` is a spacer.
4. 1px `#1a233e` / `--divider` line.
5. Promo `div.vHtml.desc-text` 14px/21px white, `white-space: pre-line`.
6. `ion-input.money-input` 50px, prefix R$, placeholder `10 - 50.000`, clear when filled.
7. 3×3 amount chips (cents). Selected: 90deg `#202940→#131a2c` + 1px `#38a8fa`.
8. Hidden 0% bonus banner — do not render.
9. **Depositar Agora** 280×40 gradient, disabled until 10–50000.

## PIX overlay (same URL)
Click **Depositar Agora** does **not** change the route. Stacked `ion-content.recharge-qr-code` with tips, amount + copy, 150×150 QR canvas, **Copiar código QR**, masked PIX, 24h countdown, order rows.

## Interaction model
Click/type driven. No scroll-driven section changes. Toast `Cópia Bem-sucedida` (ion-toast ios, 2000ms, middle).
