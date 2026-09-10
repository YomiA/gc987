# /main/perfil (logged-in personal centre) — extraction spec

Captured from `https://gc987.com/main/perfil` in the signed-in Chrome DevTools
MCP session, emulating `390x844x3, mobile, touch`. Every length below is the
`getComputedStyle` value (px) plus the rule the live CSS actually declares
(rem). Root font size is 16px at a 390px column, so `1rem = 16px`.

Local route: `/main/perfil` → `src/views/PerfilPage.vue`.

## Page topology

No header on this route: the router outlet only renders `ion-content.myMainRef`
plus the shared `ion-tab-bar`. Interaction model is **static** — nothing on the
page reacts to scroll, and the content is 783px tall inside an 844px viewport,
so it does not scroll at all.

```
ion-content.myMainRef        --background #090f1f, --padding 1rem (all sides), font 12px/16px
  ion-refresher              native pull-to-refresh (not cloned)
  div.card-bg-gradient.user  358x177 @ (16,30)
  div.vip.card-bg-gradient   358x112 @ (16,221)
  div.option.card-bg-gradient 358x326 @ (16,347)
  div                        358x80  @ (16,687)   style="height: calc(56px + 1.5rem)"
```

Vertical rhythm comes from one rule: `ion-content > * + * { margin-top: .875rem }`.
The refresher is the first child, so every visible card — including the first —
gets the 14px top margin.

## Shared card shell

- `.user`, `.vip`: `width: 100%; padding: .875rem .625rem; border-radius: .5rem`
- `.option`: `width: 100%; padding-left: 1rem; border-radius: .5rem`
- `.card-bg-gradient { background: var(--theme-color-gradient-300) }`
  → `linear-gradient(90deg, rgb(32,41,64) 0%, rgb(19,26,44) 100%)`, i.e. the
  same value this clone already stores as `--pwa-bar-bg`.

## 1. User card (`div.user`)

`.top { display: flex }`, height 79px.

| element | declared | computed |
| --- | --- | --- |
| `ion-thumbnail.avatar` | `--size: 4.75rem; --border-radius: .5rem` | 76x76, radius 8px, `img` `object-fit: cover` |
| `.messsage` | `flex: 1; flex-direction: column; justify-content: space-between; font-size: .875rem; line-height: 1.25rem; margin: 0 .625rem` | 214x79 |
| `.Id` | `display: flex; align-items: flex-end` | 214x35 |
| `.Id ion-icon` (copy) | `font-size: 1.25rem; margin-left: .125rem` | 20x20, `#fff` |
| `.level` | `position: relative; width/height: 2.1875rem; margin-left: .25rem; transform: translateY(.3125rem)` | 35x35 |
| `.level div` (badge) | `position: absolute; top: .6875rem; left: .75rem; width: 1.875rem; font-size: .5rem; font-weight: 600; display: flex; align-items: center; justify-content: center` | 30x20 |
| `.level div span` | inline `color: rgb(117,117,117)` at V0 | — |
| account row | inherits 14px/20px | 214x20 |
| `.money-color` | `display: flex; align-items: center; font-size: 1.25rem` | 214x24 |
| `.balance-wrapper` | `position: relative; overflow: hidden; margin-right: .5rem` | 37.66x20 |
| `.balance-placeholder` | `opacity: 0` | reserves the width |
| `.balance-display` | `position: absolute; left: 0; top: 0; white-space: nowrap` | — |
| `.money-color > span` (`R$`) | `margin-right: .75rem` | 23.57x20 |
| `.money-color ion-icon` | `font-size: 1.5rem; transform: rotate(30deg)` | 24x24 box, `stroke-width: 32` ionicon |
| `.email` | `position: relative; width: 1.75rem` | 28x79 |
| `.email-icon` | `font-size: 1.6rem`, `color: rgb(255,255,255)` | 25.59x25.59 |

Markup detail: `<span><span class="user-id">ID: </span> 2440420677</span>` and
`<span class="user-account">Conta:</span> 51920043604` — the live values are the
signed-in account's, so the clone ships fake digits of the same length.

`.bottom` is an `ion-row` with two `ion-col`:

- `.bottom { margin-top: 1.25rem }` → 338x50
- `ion-col` → `flex: 0 0 50%; max-width: 50%; padding: 5px` → 169x50
- `ion-col div { display: flex; align-items: center; justify-content: center; padding: .5rem 0; border-radius: .375rem }` → 159x40
- `div.left { background: var(--color-border-600) }` → `rgb(42,50,78)`
- `div.right { background: var(--theme-color-gradient-200) }` →
  `linear-gradient(rgb(19,201,106) 0%, rgb(29,149,84) 100%)` — the value this
  clone already stores as `--btn-green`
- `ion-col div ion-icon { font-size: 1.5rem; margin-right: .625rem }` → 24x24
- `.enter-withdraw-text` → `rgb(255,255,255)`, 12px/16px

Labels: `Saque`, `Depósito`.

## 2. VIP card (`div.vip`)

`.vip { font-size: .625rem }`, 358x112. `.top { display: flex; align-items: center }` → 338x28.

| element | declared | computed |
| --- | --- | --- |
| `.top .left` | `position: relative; width: 4rem` | 64x0 |
| `.left ion-img` (crown) | `position: absolute; top: -1.5625rem; left: .625rem; width: 3.375rem` | 54x54 @ (36,224) |
| `.left div` (badge) | `position: absolute; left: 2.375rem; width: 1.875rem; font-size: .6rem; font-weight: 700; display: flex; align-items: center; justify-content: center` | 30x16 |
| `.top .right` | `text-align: center; margin-left: 1rem; padding-top: .75rem; flex: 1` | 258x28 |
| `.right .level` | `display: flex; align-items: center; justify-content: space-between` | 258x16 |
| `.important-text` | `color: var(--money-text-color)` | `rgb(251,165,49)` = `--color-currency` |
| `.chevron-forward` | `font-size: 1rem`, `color: var(--color-text-gray-300)` | 16x16, `rgb(155,167,190)` |
| `.bottom` | `margin: .75rem 0` | 338x32 |
| `.bottom .line` | `display: flex; align-items: center` | 338x32 |
| `.line .left` | `width: 20%; text-align: center` | 67.59x32 (wraps to 2 lines) |
| `.line .right` | `width: 80%; height: 1rem` | 270.4x16 |
| `.right .progress` | `position: relative` | 270.4x0 |
| `ion-progress-bar` | `position: absolute; height: 1rem; border-radius: 1rem`, `--background: var(--color-bg-600)` = `#3B4152`, `--progress-background: linear-gradient(359deg, #fa9a21 1.02%, #f8da9d 89.77%)` | 270.4x16, fill `scaleX(0)` |
| `.progress div` (value) | `position: absolute; left: 50%; transform: translate(-50%); color: #fff` | 53x16 |

Text: `Siga ` + `VIP1` + ` Ainda precisa apostar 100,00`, `Aposta necessária`,
`0,00/100,00`.

## 3. Option list (`div.option`)

`ion-item { --min-height: 0; --padding-start: 0; --padding-end: 0; --padding-top: .75rem; --padding-bottom: .75rem; --background: transparent }`
plus `item-lines-none`, so each row is `padding: 12px 0` with no separator.

Row geometry at 390px: card 16..374, `padding-left: 1rem` → rows 32..374.
`.item-inner` carries `--inner-padding-end: 16px` and the detail chevron has
`margin: 0 -6px 0 8px`, which puts the chevron at 349..364 — i.e. 10px clear of
the card edge. The clone reproduces that with `padding-right: .625rem` on the
row and `margin-left: .5rem` on the chevron.

| element | declared | computed |
| --- | --- | --- |
| row | `font-size: .75rem; position: relative` | 342x54 (342x56 for Convidar) |
| `.left` | `display: flex; align-items: center`, slotted `margin-right: 16px` | 93.88x30 |
| `.left ion-img` | `width: 1.875rem; margin-right: .625rem` | 30x30 |
| `.left span` | `.user-base-color` | `#fff`, 12px/16px |
| `.middle` | `width: 100%; display: flex; justify-content: flex-end` | 199.12x0 |
| `.middle ion-label` | `flex: 2.5 1 0%; text-align: right; font-size: .625rem; max-width: 13rem` | 205.63x32 |
| `.invite-text` | `color: var(--color-text-gray-100)` | `rgb(135,146,175)` |
| detail chevron | `1.25em` of 12px | 15x15, `rgb(155,167,190)`, `opacity: 1` |

Rows in DOM order (icon → label → note):

1. `detail.png` — Relatórios
2. `convidar.png` — Convidar — note `Venha para o GC987.COM jogar comigo e descubra como ganhar dinheiro de verdade!`
3. `resgate.svg` — Código de Resgate
4. `customer.png` — Suporte
5. `security.png` — Centro de Segurança
6. (`Idioma` — present but `display: none`, not cloned)
7. `logout.png` — Sair

Every `p.red-point` badge in this list is `display: none` on the live account.

## Assets

Downloaded by `scripts/download-assets-perfil-page.mjs` into
`public/images/perfil/`:

| local | source |
| --- | --- |
| `avatar-male-1.jpg` | `https://upload-us.f-1-g-h.com/avatar/male_1.jpg` |
| `vip-crown.png` | `https://gc987.com/icons/perfil/vip0~10.png` |
| `detail.png` `convidar.png` `resgate.svg` `customer.png` `security.png` `logout.png` | `https://gc987.com/icons/perfil/…` |

Inline SVGs pulled from the `ion-icon` shadow roots into `src/assets/icons/`:
`perfil-copy.svg`, `perfil-refresh.svg`, `perfil-email.svg`,
`perfil-saque.svg`, `perfil-deposito.svg`, `chevron-forward.svg`.

## Not cloned on this pass

- `ion-refresher` pull-to-refresh on the content.
- `div.box.xuanfu.touming`, the body-level floating widget parked at
  `left: -40px..20px` (a 60x60 `li.box-item` peeking at the left edge around
  y=200..260). It is app-shell furniture that exists on every route including
  `/main/inicio`, and this clone's shell does not have it yet.
- Sub-entries behind each row (the VIP card chevron, the envelope, the
  copy and refresh buttons, and the Saque / Depósito buttons) — next
  pass. Relatórios → `/user/report`, Convidar → `/spread`, Código de
  Resgate → `/main/promo` with the `resgate` segment selected, Suporte →
  `/notification` (Centro de Mensagens, default **Suporte** tab), Centro
  de Segurança → `/security`. **Sair** opens the logout confirm modal
  (`LOGOUT_MODAL.spec.md`); Cancelar dismisses, the modal **Sair**
  button is a no-op stub. Password / email sub-pages behind Centro de
  Segurança are first-page only.
