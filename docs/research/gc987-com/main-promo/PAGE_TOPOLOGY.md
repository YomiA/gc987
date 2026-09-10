# /main/promo — page topology

Source: `https://gc987.com/main/promo`, reached from `/main/inicio` by tapping the
bottom `Promoção` tab. Extracted via Chrome DevTools MCP at `390x844x3, mobile, touch`,
theme `blue-default`, body `home-type-Platform default v01`.

Reference screenshots: `docs/design-references/gc987-com/main-promo/`.

## Shell

The promo route is its own `.ion-page` (z-index 101) stacked over the still-mounted
inicio page. It contains only two things:

| # | Element | Box | Notes |
|---|---|---|---|
| 1 | `ion-header > ion-toolbar.toolbar-segment > ion-segment.segment-scrollable` | 390x50 @ y=0 | z-index 10, does not scroll |
| 2 | `div.flex.h-full > ion-content > div` | content 390x794 @ y=50; inner 360x1948 @ x=15,y=60 | vertical scroller, `scrollHeight` 1958 |

The bottom tab bar is **not** part of this page — it is the app-level bar shared with
`/main/inicio` (measured 390x56 @ y=789 on both routes), so the clone reuses the
existing `TabBar.vue` untouched.

### What this page does NOT have

Verified on a cold direct load of `/main/promo` (no prior navigation):

- no PWA install top bar (`#pwa-header-bar` belongs to the inicio page's own header)
- no site header (logo / ENTRAR / REGISTRO / search)
- no floating support button
- no side drawer / hamburger
- no PWA install modal on first load

## Content order (Eventos tab, 14 cards)

All cards are identical in structure and box; only the background image, the red
badge and the `shiny` sweep differ.

| # | Local asset | Live source | Badge | Shiny | Banner copy |
|---|---|---|---|---|---|
| 1 | `weekly-compensation.png` | `s3/1765558377758/13.png` | – | – | 50% DE COMPENSAÇÃO POR SEMANA |
| 2 | `loss-rebate.png` | `s3/1765558055054/11.png` | – | – | 50% DE REEMBOLSO SOBRE PERDAS |
| 3 | `invite-friend.png` | `s3/1765467021238/2.png` | – | – | CONVIDE 1 AMIGO E GANHE R$56 |
| 4 | `vip-bonus.png` | `s3/1765467191583/3.png` | – | – | VIP BÔNUS … R$55.555 |
| 5 | `daily-checkin.png` | `s3/1767170480010/check.png` | – | – | DIÁRIO CHECK-IN … R$320 |
| 6 | `member-day.png` | `s3/1767170515818/menber.png` | yes | yes | DIA DO MEMBRO … R$777.777 |
| 7 | `friend-help.png` | `s3/1765468654699/4.png` | yes | yes | COM A AJUDA DE UM AMIGO GANHE R$100 |
| 8 | `tuesday-recharge.png` | `s3/1767170643803/week.png` | – | – | OFERTA … TERÇA-FEIRA … 15% DE CASHBACK |
| 9 | `lucky-test.png` | `s3/1767170617701/deposit.png` | – | – | Teste a sua sorte … R$ 500 |
| 10 | `random-bonus.png` | `s3/1765467120479/8.png` | – | – | 12 VEZES AO DIA BÔNUS ALEATÓRIO R$7.777 |
| 11 | `bet-cashback.png` | `s3/1765978911895/10.png` | – | – | 5% VALOR DA APOSTA TROCADO POR DINHEIRO |
| 12 | `whatsapp-channel.png` | `s3/1765979999527/16.png` | – | – | SIGA O CANAL OFICIAL DO WHATSAPP |
| 13 | `mystery-bonus.png` | `s3/1765557734727/9.png` | – | – | BONUS MISTERIOSO … ATÉ R$8.888 |
| 14 | `telegram-channel.png` | `s3/1765558809882/15.png` | – | – | SIGA O CANAL OFICIAL DO TELEGRAM |

Every banner is a 660x220 PNG rendered into a 360x120 box (`background-size: 100% auto`).

## Scroll geometry

- `ion-content` custom props: `--background: #090f1f`, `--padding-top: 10px`,
  `--padding-start: 15px`, `--padding-end: 15px`, `--padding-bottom: 0px`
- inner list wrapper: `padding: 0 0 72px`, height 1948px
- card pitch 134px = 124px box + 10px `margin-bottom`
- first card at document y=60, last card top at y=1802
- max `scrollTop` = 1164 (1958 − 794)
- scrollbar hidden: `::part(scroll) { scrollbar-width: none }`
