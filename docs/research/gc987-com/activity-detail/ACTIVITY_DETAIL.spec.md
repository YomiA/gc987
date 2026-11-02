# /activity/:type/:id — Eventos detail

Extracted from `https://gc987.com/activity/Assistance/3734@style_0` at
`390x844x3`. Opened from `/main/promo` Eventos cards. Live jump is
`/activity/${type}/${id}` with optional `@style_N` via `activityDetailSelect`.

First live card: type `Assistance`, id `3734@style_0`. Other event types
reuse this Assistance chrome until their own layouts are cloned. VIP cards
go to `/activity/vip` instead.

Mock only — Receber does not post.

## Shell

No TabBar, no SideFab. Header 50×390, toolbar `--background #154084`.
Back 38×22. Title inner 16px/400/28, pad `0 90px`. Content ion-padding 16px,
`--background #090f1f`, 390×794 @(0,50).

## Banner + clock

`.h-[9.375rem]` 358×150 @(16,66), radius 10, `rescue_weekly_banner.png`.
Countdown wrap 117×30 @(26,86); three 35×30 cells, gap 6px, bg
`rgba(255,255,255,.4)`, radius 5, pad `4 0 0`. Digit 12px/700/14; unit
10px/400/8 `DAY` / `HRS` / `MIN`.

Caption 12px/16: `Evento de Contagem Regressiva: permanente`, chip bg
`#101629`, radius 5, pad `4 6`, margin `14px 0`.

## Rescue table

Heading `Valor de resgate` 14px/700/21, mb 8.
Wrap 358×276.67, border `1px #2a324e`, radius 5.
thead 14px/400, color `rgba(255,255,255,.5)`, bg `#101629`.
tbody left white 14px/700; right `#fba531`.

## Week boxes

`Lucro e perda da semana` 14px/900, mt 20 mb 8.
Two cols 169×60, gap 20, border `#2a324e`, radius 5, pad `8 5`.
Labels 12px `rgba(255,255,255,.5)`; values 15px/700 white. Live both `R$ 0,00`.

## Rules + footer

`Regras do evento` 16px/500/24, color `rgba(255,255,255,.4)`, mb 20.
`.item-wrap` bg `#101629`, radius 10, pad 10, 12px/18.
Footer fixed 390×80 @(0,764), bg `#191e2d`, pad `20 0 0`, inset shadow
`--divider`. Receber `.btn.unable` 280×40 @(55,784), radius 10, bg `#626262`.
