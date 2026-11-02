# /activity/rebate/record — Rebate Histórico

Extracted from `https://gc987.com/activity/rebate/record` at `390x844x3`.
Opened from `/main/promo` Rebate → Histórico. Must be registered before
`/activity/:type/:id`.

Mock list is empty. No live post.

## Shell

No TabBar, no SideFab. Toolbar `#154084`, ion-no-border. Title inner
20px/400/30, copy `Taxa de reembolso`. Content pad 16px, bg `#090f1f`.

## Filter row

358×32 @(16,76), margin `10px 0`.

- Time pill ~88.5×24. Live showed the i18n key `sort.`; clone uses `Tempo`
  (same dateRanges as other history pages).
- Platform pill ~113.3×24, default `Todos`.
- Column labels `Aposta` and `Taxa de reembolso` ~62px, wrapping.

Pills: border `rgba(255,255,255,.4)`, radius 10, pad `4 4 4 8`, max-height
1.5rem.

## Empty

`/icons/No_record.png` (clone: `/images/promo-page/no-record.png`) 120×120,
mt 144px. `Sem Registros` 14px/20 `rgba(255,255,255,.4)`.
