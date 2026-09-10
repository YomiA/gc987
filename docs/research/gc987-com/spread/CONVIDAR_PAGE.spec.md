# /spread — "ConvidarCentro" (Perfil → Convidar)

Extracted from `https://gc987.com/spread` in the logged-in Chrome DevTools MCP
session, emulating `390x844x3, mobile, touch`. All values are
`getComputedStyle` / `getBoundingClientRect` readings, `ion-*` hosts read
through their shadow roots. Local route: `/spread`.

Reached by tapping **Convidar** on `/main/perfil` — a route push, not an
overlay.

## Shell

| element | geometry | style |
| --- | --- | --- |
| `ion-header.ion-no-border` | 390x104 | transparent, `z-index: 10`, **no** elevation (unlike `/user/report`) |
| `ion-toolbar` (ios) | 390x50 | `--background: #101629`, `--min-height: 3.125rem`, `--padding-start/end: 4px` |
| back `ion-button` | 38x22 @(6,14), glyph 16x16 @(16,17) | same custom chevron as `/user/report` (`report-back`) |
| `ion-title` (ios) | absolute over the toolbar, `padding: 0 90px` | 20px/30px, centred; text is literally `ConvidarCentro` (two i18n keys, no space) |
| `div.tab-box` | 390x54 @(0,50) | `padding: 10px`, `background: rgb(9,15,31)`, `overflow: hidden` |
| `ion-content` inner scroller | 370x740 @(10,104) | `margin: 0 10px`, scrolls, no visible bar |

No bottom tab bar on this route.

## Pill segment (6 tabs)

`ion-segment.segment-scrollable` 370x34 @(10,60): transparent, `border-radius:
8px`, `overflow-x: auto`, `justify-content: start`. Inside, `div.btn-wrap`
(735.38 wide, `space-evenly`) holds one `div.btn-item-wrap` per tab
(`position: relative`, `margin-right: 10px`).

`ion-segment-button`: `height: 30`, `min-height: 28`, `margin: 2px 0`,
`border-radius: 7px`, `background: rgb(17,21,36)`, `color: #fff` in **both**
states, `font-size: 11.2px` (0.7rem), `--padding-start/end: 13px`,
`white-space: nowrap`. Checked state paints
`--indicator-color: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%)` at 7px
radius with `box-shadow: 0 0 5px 0 rgba(0,0,0,.16)`; `--indicator` transition is
`none`, so there is no sliding indicator — the pill simply swaps its own
background. Ionic keeps the checked pill scrolled into view.

Intrinsic widths (label + 26px), left edges 10px apart:

| tab | x | width |
| --- | --- | --- |
| Link de Convite | 10 | 102.05 |
| Rede de Agentes | 122.05 | 110.02 |
| Desempenho | 242.06 | 91.80 |
| Comissão | 343.87 | 76.27 |
| Taxa de Bônus do Agente | 430.13 | 152.71 |
| Registrar Subordinados | 592.84 | 142.54 |

`scrollWidth` 735.38 against `clientWidth` 370.

## Tab 1 — "Link de Convite"

### Account block (`ion-toolbar.agent-info`)

370x138 @(10,104), `#101629`, `border-radius: 10px`, `margin-bottom: 10px`. The
live toolbar paints its background in a square shadow child and rounds it with
`contain: content`, so the clone clips with `overflow: hidden`. Body font
14px/20px white.

- `div.info` 370x97, `display: flex`, `padding: 10px`.
- Left column 273.75x77 @(20,114), `flex: 1`, column.
  - `MeuID:` + value @(20,114), row 20 tall, `margin-bottom: 10px`. Label
    `rgb(155,167,190)` 14px/17px, value white 14px/20px, boxes adjacent (no
    space in the markup).
  - `ConvidadorID:` + value @(20,144), same rules.
  - `Coletável` + `span.money-text` @(20,174), row 17 tall (17px line-height),
    amount `rgb(251,165,49)`, one space before it.
- Right column 76.25x77 @(293.75,114), column, `justify-content: center`.
  - **Receber** `ion-button` 76.25x30 @(293.75,117.5), `margin-bottom: 10px`.
    `--background` is `#38a8fa` but this account renders it disabled, so the
    native button is `rgb(141,141,141)`.
  - **Histórico** 76.25x30 @(293.75,157.5), `rgb(255,182,113)`.
  - Both: `border-radius: 4px`, `padding: 4px 11.7px`, 13px/500 white,
    md elevation-2 shadow, `text-transform: none`.
- `div.receive-rule` 370x41 @(10,201): `display: flex`, `padding: 0 10px`,
  `justify-content: space-between`, `border-bottom: 1px solid rgb(26,35,62)`
  (clipped by the card radius). `div.text` is 80% wide (280x40) and holds
  `span.hint` — 14px/17px `rgba(255,255,255,.4)`, wrapping to two lines:
  "O tempo de resolução da comissão é de 4:00-8:00 todos os dias." A sibling
  `div.btn-warpper` is `display: none`.

### Referral card (`div.agent-share-info`)

370x223 @(10,252), `#101629`, `padding: 10px 15px`, `border-radius: 10px`.

- `div.referral-tips` 340x34 @(25,262): "Informação de Referência", 14px/20px
  white, `padding-bottom: 13px`.
- Row 340x109 @(25,306), `justify-content: space-around`, `margin: 10px 0`.
  - QR tile 75x100 @(26.25,306): `min-width: 4.6875rem`, `height: 6.25rem`,
    column, `border-radius: 5px`, `background: rgb(23,36,79)`,
    `overflow: hidden`, `margin-right: 10px`.
    - Pad 75x75, `padding: 5px`, centred; QR box 65x65 @(31.25,311) with
      `background: #BEBEBE`. The live box holds a `<canvas width=195 height=195
      style="width:65px;height:65px">` drawn from the account's real referral
      link, so only the placeholder tile is reproduced.
    - `div.save-qrcode-btn` 75x28 @(26.25,381): `flex: 1 1 0%`,
      `background: rgb(22,128,220)`, 10px/28px white, centred. Its 28px line
      cannot shrink into the 25px left in the tile, so it overflows 3px and the
      tile clips it — reproduced as-is.
  - Link column 250x109 @(113.75,306): `flex: 1`, `max-width: 15.625rem`,
    10px/15px.
    - `p` "Meu link" 250x15, `margin-bottom: 7px`, white.
    - `div.agent-share-link` 250x87 @(113.75,328): `padding: 5px`,
      `border: 1px solid rgb(26,35,62)`, `border-radius: 5px`,
      `justify-content: space-between`.
      - Link text 200x75 @(119.75,334), `max-width: 12.5rem`,
        `rgb(155,167,190)`, wraps mid-token into five 15px lines.
        **Live value is account-identifying and is replaced by a same-shaped
        mock** so the five-line wrap is preserved.
      - Action column 24x75 @(333.75,334): `padding: 12px 0 12px 4px`, column,
        `space-between`. Share glyph 18x18 @(337.75,346) with
        `margin-bottom: .6rem`; copy glyph 20x20 @(337.75,377). Both white,
        `stroke/fill: currentColor`.
- Share row `ion-segment.segment-scrollable` 340x40 @(25,425), `overflow-x:
  auto`. Nine `ion-segment-button` 37.59x40, `margin: 0 6px`,
  `border-radius: 6px`, each wrapping a 35x35 `ion-icon` (first at
  @(32.3,427.5)). Order: e-mail (blue `#1A6AE7`→`#20C2F4` envelope), YouTube,
  Kwai, X, WhatsApp, TikTok, Instagram, Telegram, Facebook — all inline brand
  SVGs from the bundle, saved to `src/assets/icons/convidar-*.svg`.

### Summary cards (`ion-list.card`)

370 wide, `padding: 0 15px`, `margin: 10px 0`, `background: rgb(16,22,41)`,
`border-radius: 10px`. Comissão 176 tall @(10,485) (4 rows), Desempenho 308
tall @(10,671) (7 rows); adjacent 10px margins collapse to 10.

Rows are `ion-item` 340x44: `--padding-start: 0`, `--padding-end: 10px`,
`--inner-padding-end: 0`, `--min-height: 44px`, `align-items: center`,
`justify-content: space-between`. The hairline lives on `.item-inner` (330
wide, i.e. minus the 10px end padding): `0.5px solid rgb(64,64,64)`, dropped on
the last row (`item-lines-none`).

- Header row: label 15px/22.5px white @(25,495.5) 276.84x22.5 (`margin-right:
  8px`), `ion-note.more` "mais" 12px/16px `rgb(22,128,220)` @(309.84,498.75),
  then the ios detail chevron 14x14 @(336,499.75) — `rgb(109,120,141)` at
  `opacity: .25`, 5px off the hairline end.
- Value rows: label 12px/18px `rgb(155,167,190)` @x=25 (289.41 wide), value
  12px/16px with `margin-right: 10px`. Comissão values are
  `rgb(251,165,49)`; Desempenho values are white.

Content (mock account, all zeroed exactly as the live account renders):

- Comissão — Comissão Total `0,00`, Comissão Recebida `0,00`, Última Comissão
  Recebida `0,00`.
- Desempenho — Total de Membros da Equipe `(0/0) Pessoa`, Subordinados Diretos
  `(0/0) Pessoa`, Outros Membros `(0/0) Pessoa`, Rendimento Total `0,00`,
  Desempenho Direto `0,00`, Outro Desempenho `0,00`.

## Tab 2 — "Rede de Agentes"

`src/components/perfil/convidar/AgentNetworkPanel.vue`, data in
`getSpreadNetwork()`. Same shell and segment; only the scroller body changes,
and unlike tab 1 it is **not** inset — the body is
`div.card.h-full.overflow-y-auto` 390x740 @(0,104) with `padding: 0 0 10px`,
wrapping `div.px-2` 390x1310.55 @(0,114). `scrollHeight` 1331.

Everything on this tab is static worked-example copy (agents A/B1-B3/C1-C3),
not account data, so nothing here needed masking.

### 1. Self card — 354x162 @(18,114)

`margin: 10px`, `padding-bottom: 16px`, `border 1px rgb(42,50,78)`,
`radius 10px`, 10px/15px, centered. Flex row `padding: 12px 8px`,
`align-items: center`:

- Avatar 48x48 @(51,163), `margin-left: 24px`, white background +
  `manA.png` at `background-size: 100% 100%`, `border 1px rgb(255,170,9)`,
  `radius 9999px`. Level badge 16x16 @(84,196) is a `position: relative`
  child pushed `left/top: 32px`, background `rgb(255,170,9)`, 10px/16px.
- `ul` 224x120 @(115,127) (`w-2/3`, `margin-left: 16px`, `line-height: 20px`,
  left aligned). Three `li` of 40, each holding two `inline-block` 100%-wide
  spans of 20: the plain white total, then the label plus an
  `em.money-text` figure in `rgb(251,165,49)` — italic, since the live page
  keeps `em`'s default style. Rows: `Desempenho total 28500` /
  `Comissão total 225`, `Desempenho direto 5500` /
  `Retorno de Comissão 3% Comissão Direta 165`, `Outro desempenho 3000` /
  `Comissão escalonada 2% outra comissão 60`.

### 2. Tree diagram — 374x361.59 @(8,286)

`position: relative`, `padding: 8px`, `margin-top: 8px`. Nine absolutely
positioned arrow layers sit under two node rows. Each layer holds one
`ion-icon` sized `1em` (`text-[17rem]` = 272, `text-[6rem]` = 96); the SVG
letterboxes inside that square, so the thin arrow stays undistorted.

Four distinct SVGs, cloned into `src/assets/icons/`:

| File | Box | Fill | Used by |
| --- | --- | --- | --- |
| `spread-arrow-c2.svg` | 43x329 | `#1DB31E` | `c2-arrow-toA` |
| `spread-arrow-c1.svg` | 67x330 | `#1DB31E` | `c1-arrow-toA`, `c3-arrow-toA` (mirrored) |
| `spread-arrow-b.svg` | 12x117 | `#1C58F9` | `b1`/`b2`/`b3-arrow` |
| `spread-arrow-c.svg` | 12x117 | `#1DB31E` | `c1`/`c2-arrow-toB1`, `c3-arrow-toB3` |

Layer geometry (offsets relative to the tree's padding box for the three big
ones, relative to the owning `ul` for the six small ones, since each of those
lives in a static `li`):

| Layer | Size | top / left | transform |
| --- | --- | --- | --- |
| `c2-arrow-toA` | 272x278.5 | -0.1 / 89.76 | — |
| `c1-arrow-toA` | 272x278.5 | -0.1 / -105.6 | — |
| `c3-arrow-toA` | 272x278.5 | -0.1 / 207.59 | `scaleX(-1)` |
| `b1-arrow` | 96x102.5 | -64.09 / 35.2 | `rotate(30deg)` |
| `b2-arrow` | 96x102.5 | -62.5 / 128.88 | — |
| `b3-arrow` | 96x102.5 | -64.09 / 230 | `rotate(-30deg)` |
| `c1-arrow-toB1` | 96x102.5 | -43.3 / 8 | — |
| `c2-arrow-toB1` | 96x102.5 | -49.7 / 82.34 | `rotate(-28deg)` |
| `c3-arrow-toB3` | 96x102.5 | -43.3 / 250.81 | — |

Over them, `div.pt-14` 358x176 @(16,294) then
`div.relative.z-10.mt-[3.1rem]` 358x120 @(16,519.59).

Chips (`padding: 2px`, `min-height: 20px`, `border 1px rgb(42,50,78)`,
`radius 6px`, background `#101629`, 9.6px, centered):

- Three "contribui para A" callouts, `position: absolute`, `z-index: 20`,
  `line-height: 9.6px`, two lines split by a `<br>`:
  `C1` 100.8x25.2 @(16,302) (`width: 6.3rem`, top 16 / left 8),
  `C3` 100.8x34.8 @(281.2,302) (top 16 / left 273.2, note wraps to 2 lines),
  `C2` 96x25.2 @(220.41,473.2) (`width: 6rem`, top -46.4 / left 204.41).
- Six node chips 88x38 (`width: 5.5rem`, `line-height: 16px`,
  `position: relative`) reading `<name>contribui comissão <em>`.

Node rows are `ul.flex.justify-between.items-center` 358x120 (the B row adds
`margin-bottom: 4px` and `z-index: 10`); three `li.agent-item` 112x120,
`flex-direction: column`, `justify-content: space-between`, so the chip sits
at the top and the stat box at the bottom. Stat box 108.8x64
(`width: 6.8rem`, `padding-top: 28.8px`, `border 1px rgb(42,50,78)`,
`radius 6px`, 10px/10.4px) holds `Apostas válidas <n>` and the 48x48 avatar,
which is `position: absolute; top: -50%; left: 50%;
transform: translate(-50%, 15%)` with a white border. Badges here have no
background — just the label at the circle's bottom-right.

Avatars are downloaded by `scripts/download-assets-spread-page.mjs` into
`public/images/spread/`; the live page reuses `manB1.png` for B3 and
`womanC1.png` for C3, so only five files exist.

### 3. Tutorial article — 374x776.95 @(8,647.59)

`div.tutorial-detail`: `padding: 6.4px`, `border 1px rgb(42,50,78)`,
`radius 4.48px`, 9.6px/14.4px, `rgb(109,120,141)`. Children:
`h1 > strong` 13.44 tall (11.2px/500, inner `strong` 700), a 129.59-tall `p`
with `text-indent: 14.4px`, a 14.4-tall `div` lead line, then a 604.73-tall
`ul` (`list-style: none`) of five items measuring 14.4 / 14.4 / 14.4 / 100.79
/ 460.75 — the last two nest their own `ul`. Bold leads are `strong`,
figures are italic `em` in the same grey as the body (no amber here). The
copy is kept verbatim in the component since it is static i18n prose.

## Tab 3 — "Desempenho"

`src/components/perfil/convidar/PerformancePanel.vue`, data in
`getSpreadPerformanceColumns()` / `getSpreadPerformance()`. The body is
`div.agent-performance` 390x740 @(0,104) with `padding: 10px 10px 0`: a flex
column that fills the viewport and never scrolls (`scrollHeight` 740).

### Filter bar — 370x52 @(10,114)

`display: flex`, `padding: 10px`, `justify-content: space-between`,
background `rgb(18,22,36)`, radius `10px 10px 0 0`, 12px/16px,
`rgb(86,100,136)`.

- Date field `div.date.calendar` 98x32 @(20,124): `padding: 2px 4px`,
  background `rgb(9,15,31)`, radius 6px, centered. Inside,
  `div.timeChoose` 85x20 @(29,130) (`margin-left: 5px`,
  `justify-content: space-between`, `flex: 1`) holds the value
  `div.single-date` 63.98x16 @(29,132) (`margin: 2px 0`, **700** weight,
  white, printed `YYYY/MM/DD`) and a 16x16 calendar `ion-icon` @(98,132),
  cloned as `spread-calendar.svg` (17x18, stroke `currentColor`).
- `ion-searchbar` 252x32 @(118,124): `padding-left: 8px`, `flex: 1`,
  `overflow: hidden`, no background of its own. The `input` 244x26.5
  @(126,126.75) carries the pill: `padding: 6px 12px 6px 5px`, background
  `rgb(9,15,31)`, radius 6px, 12px, placeholder `ID`. Ionic's own
  search/clear icons are hidden; the visible 14x14 magnifier @(352,133) is a
  separate absolutely positioned `ion-icon` in `rgb(155,167,190)`
  (`spread-search.svg`).

### Table header — 370x48 @(10,166)

`ion-item.performance-item-title`, native part background `rgb(21,28,48)`
with `padding-left: 10px`, 11px/16px white. Inside, `ion-grid` 344x32
@(20,174) of five centred `ion-col`: `ID` 16.6667% (57.33 @20),
`Número de Subordinados` / `Aposta` / `Desempenho` / `Depósito` 20.8333%
each (71.66 @77.33 / 148.99 / 220.66 / 292.32). The second label wraps onto
two 16px lines, which is what makes the row 32 tall.

### Empty list — `div.flex-1` 370x630 @(10,214)

Wraps a nested `ion-content`; the empty block is 370x291 @(10,214) — not
centred, because the artwork carries `margin-top: 144px`. Image 120x120
@(135,358) is `/icons/No_record.png` at `background-size: 120px auto` (the
project already has this file as
`public/images/promo-page/no-record.png`); label "Sem Registros" 90.43x22
@(149.78,478), `margin-bottom: 5px`, 14px/22px, `rgb(99,100,105)`.

### Date picker popover

`src/components/base/DatePickerPopover.vue` — an `ion-popover`
(`popover-side-bottom`) holding an `ion-datetime` in date presentation.
Both run `--background: transparent`, so the page reads straight through the
panel; only the `ion-backdrop` at opacity **0.32** and the md three-layer box
shadow separate them.

| Part | Geometry |
| --- | --- |
| Panel | 250x350 @(12,156), radius 4 — pinned under the field, clamped 12 from the viewport edge |
| Header | 250x80: month toggle 154x54 @(12,156) top-aligned, prev/next 96x56 @(166,156) with 48x48 buttons bottom-aligned @(166,164)/(214,164) |
| Month label | `setembro de 2026` (`pt-BR` long month + year), 14px/600 `line-height: normal`, `rgb(22,128,220)`. The toggle is an `inline-block` 154 wide holding `span#toggle-wrapper` (`inline-flex`, `margin: 10px 8px 10px 0`) 114x34 @(28,+10); long month names wrap onto a second line and the 18x14 caret (14x14 glyph, `padding-left: 4`) follows the text at (124,+20) |
| Weekday row | 250x24 @(12,212), grid of 7x33.43, 12px/600/24, `rgb(179,179,179)`, uppercase |
| Day grid | rows of 41.1, day buttons 32x32 radius 160, 14px; first row at y=248.55, columns at x=20/53.42/86.85/120.28/153.71/187.14/220.57 |
| Picked day | background `rgb(22,128,220)`, weight 600, white |
| Today | text `rgb(22,128,220)` on no background (`calendar-day-today`), which still shows when `max` has made it inert |
| Out of range | `opacity: 0.4` and inert; whole months outside `min`/`max` also grey out that month arrow (`opacity: 0.5`) |
| Footer | 250x48.5 @(12,457.5) with `border-top: 0.5px solid rgb(51,51,51)` and `padding: 8`, `Cancelar` 93.91x32 @(22,466) and `Feito` 57.58x32 @(194.42,466), 14px/500 uppercase, `letter-spacing: 0.84px`, `rgb(22,128,220)` |

Behaviour matches the live one: tapping a day only moves the highlight, the
field commits on **Feito**, and Cancelar or the backdrop dismisses without
changing it.

### Segment scroll

Selecting a tab centres its pill in the strip (clamped to the scroll range),
so Desempenho leaves `scrollLeft` at 93 with the pill at x=149.06.
`ConvidarSegment` now reproduces that; the earlier `scrollIntoView` only
matched for the first two tabs, which happen to clamp to 0.

## Tab 4 — "Comissão"

`src/components/perfil/convidar/CommissionPanel.vue`, data in
`getSpreadCommissionColumns()` / `getSpreadCommissionTypes()` /
`getSpreadCommission()`. The body is `div.agent-commission` 390x740 @(0,104)
with `padding: 10px 10px 0` and `text-xs`; like Desempenho it fills the
viewport and never scrolls (`scrollHeight` 740). The column is filter bar →
header → list slot → empty block → trailing `div.flex-1`, so the artwork is
placed by its own margin instead of being centred in the leftover space.

### Filter bar — `div.select-item` 370x48.2 @(10,114)

`display: flex`, `padding: 10px`, `justify-content: space-between`,
background `--color-bg-1100` `rgb(18,22,36)`, radius `10px 10px 0 0`,
12px/16px, `#8f9cb4`. The 48.195 height is *not* set anywhere — it is the
select's `min-height: 1.7625rem` plus the 10 padding, and the date field
stretches to it.

- Date range `div.select-date` 182.17x28.2 @(20,124): `padding: 2px 4px`,
  background `--color-bg-300` `rgb(9,15,31)`, radius 6px, `align-items:
  center`. Everything inside is content-sized, so the field width follows the
  two dates.
  - `div.date.calendar.range-mode` 174.17x24 @(24,126.09): `padding: 2px 4px`,
    `justify-content: space-between`. **This** is the box the calendar hangs
    off, which is why the popover lands at y=150.09 and not at the field's 152.2.
  - `div.timeChoose` 161.17x20 @(33,128.09): `margin-left: 5px`, `flex: 1`,
    `justify-content: space-between`, holding `p.range-start` 60.59x16
    @(33,130.09), `span.separator` "～" (U+FF5E) 12x16 @(97.59,130.09)
    (`margin: 0 4px`, **700**), `p.range-end` 60.59x16 @(113.59,130.09) and the
    16x16 calendar `ion-icon` @(178.17,130.09) (`margin: 2px 0 2px 4px`), all
    in `#8f9cb4`. Dates print `YYYY-MM-DD` here, not the `YYYY/MM/DD` of
    Desempenho.
  - While a calendar is up, the end being edited takes `p.on` →
    `border-bottom: 1px solid rgb(22,128,220)`, which grows that line to 17 and
    recentres it at y=129.59.
- Category select `div.ab-select-container` 120x28.2 @(250,124) → cloned as the
  reusable `src/components/base/AbSelect.vue`; see below.

### Table header — 370x48 @(10,162.2)

`ion-item.commission-item-title.item-lines-none`, native part background
`rgb(21,28,48)` with `padding-left: 10px`, 11px/16px white. `ion-grid`
344x32 @(20,170.2) (Ionic's 16 inner end padding is what trims 360 to 344) of
five centred `ion-col`: `Tempos` 25% (86 @20), `Tipos` 12.5% (43 @106),
`Desempenho` 25% (86 @149), `Número de Pessoas` 16.6667% (57.33 @235),
`Comissão` 20.8333% (71.66 @292.33). The fourth label wraps onto two 16px
lines, which is what makes the row 32 tall.

### List slot and empty block

- `div.flex.items-center.justify-center` 370x**0** @(10,210.2) — the row slot,
  which collapses while there is nothing to show.
- `div.flex.flex-col.items-center.justify-center` 370x292.59 @(10,210.2):
  image 120x120 @(135,355.79) with `margin-top: 9.1rem` (145.6) — 1.6 lower
  than Desempenho's 144 — over label "Sem Registros" 90.43x22 @(149.78,475.79),
  `margin-bottom: 5px`, 14px/22px, `rgb(99,100,105)`.
- `div.flex-1` 370x341.21 @(10,502.79), empty, wrapping a nested `ion-content`.

### `ab-select` — `src/components/base/AbSelect.vue`

A different widget from the bordered pill in `DropdownSelect.vue`: the field is
filled and the panel has no background of its own.

| Part | Geometry |
| --- | --- |
| Field | `min-width: 7.5rem` / `min-height: 1.7625rem`, `padding: 0 12px`, background `rgb(9,15,31)`, radius 6, `justify-content: space-between`, `transition: .2s` |
| Label | `flex: 1`, 14px/1.4 `rgb(155,167,190)`, left aligned — 80x19.59 @(262,128.3) |
| Caret | 16x16 @(342,130.09) `rgb(168,171,178)` (ionicon chevron-down), `transform: rotate(180deg)` while open with `transition: transform .2s` |
| Panel | `--width` = the field (120), pinned at its bottom-left → 120x252 @(250,152.2), radius 4, md elevation shadow, `--background: transparent`, `--max-height: 90%`, backdrop black **0.32** |
| Options | 7 rows of 36 (`Todos`, `Slot`, `Cartas`, `Pesca`, `Cassino`, `Esportes`, `Lotaria`), text 12px/150% **700** centred, `transition: .2s`; selected `rgb(59,65,77)` on `rgb(22,128,220)`, the rest transparent on `rgb(155,167,190)` |

Picking an option updates the field and dismisses; the animation is Ionic's md
popover pair (content scales 0.8→1 from its top-left over 300ms, opacity 150ms;
leave fades 150ms).

### Range selection is one calendar, twice

The live field reuses the single-date `ion-datetime`:

1. Tapping the field opens it with `min` = now − 1 year, `max` = now, value =
   the current start.
2. **Feito** commits the start *and* collapses the end onto it
   (`2026-09-03 ~ 2026-09-03`), then immediately reopens the same popover with
   `min` = that day, so earlier days are inert and it is the highlighted one.
3. **Feito** commits the end.

`DatePickerPopover` therefore gained a `min` prop (and the matching grey-out of
the "previous month" arrow); `CommissionPanel` drives the two steps and moves
the `p.on` underline between the two dates.

## Tab 5 — "Taxa de Bônus do Agente"

`src/components/perfil/convidar/BonusRatePanel.vue`, data in
`getSpreadRateTabs()` / `getSpreadRates()`. The body is
`div.agent-bonus-rate` 390x740 @(0,104) with `padding: 10px 0 0` and
`text-xs`; like Desempenho it fills the viewport and never scrolls
(`scrollHeight` 740). The nested list is the thing that scrolls (Slot's
20×40 ladder is 800 tall inside 639.2). Default sub-tab is **Slot**
(live `value="ELECTRONIC"`).

### Sub-segment — 360x34.8 @(15,114)

`ion-segment.md.segment-scrollable.w-[22.5rem].mx-auto`, `display: grid`,
`grid-template-columns: 90px 90px 90px 90px`, `--background: #101629`,
hairline `border-bottom: 0.8px solid rgb(26,35,62)`. Four buttons of **80×34**
with `margin-right: 10px` (Slot @15.2, Cartas @105.2, Pesca @195.2,
Cassino @285.2). Labels are 12px/22px with `margin: 6px 0`,
`text-transform: capitalize`; idle `ion-label.base-tab` is
`rgb(109,120,141)`, checked `ion-label.selected-tab` is white. The 2px
underline is `--indicator-color: #38a8fa` (`transform` 0.25s
`cubic-bezier(0.4, 0, 0.2, 1)`), not a sliding pill.

Live values: Slot=`ELECTRONIC`, Cartas=`CHESS`, Pesca=`FISHING`,
Cassino=`VIDEO`.

### Table header — 360x48 @(15,156.8)

`ion-item.rate-item-title.w-[22.5rem].mx-auto.mt-[0.5rem]`, background
`rgb(21,28,48)`, 10px/16px white. Inner `ion-grid` 360x42 @(15,159.8) of
three equal 33.3333% cols (`padding: 5px`): `nível`, `desempenho`,
`Taxa de Bônus do Agente`. The third label wraps onto two 16px lines,
which is what makes the grid 42 tall inside the Ionic 48 min-height.

### Ladder — nested `ion-content` 390x639.2 @(0,204.8)

Each row is `ion-item.h-[2.5rem].w-[22.5rem].mx-auto.text-[.625rem]`:
the **host is 40 and `overflow: hidden`**, clipping Ionic's 48 min-height,
so the 26-tall grid (`ion-col` padding 5) sits 11 from the top of the
row rather than centred in 40. Even rows carry class `odd` and paint
`rgb(21,28,48)` on the native part. Level + desempenho are
`table-content-text-color` `rgb(109,120,141)`; the rate column is
`.important-text` `--color-currency` `rgb(251,165,49)`. No hairlines.
The inner scroller uses `scrollbar-width: none`.

Slot / Cartas / Pesca share the same 20-step ladder (`10,00+` → `0,10%`
… `10.000.000,00+` → `2,00%`). Cassino is a shorter 8-step one
(`50.000,00+` → `0,05%` … `3.300.000,00+` → `0,40%`). This is static
config the live page ships, not account data.

## Tab 6 — "Registrar Subordinados"

`src/components/perfil/convidar/RegistrarPanel.vue`, copy in
`spreadRegisterCopy`. In-page tab, no route change. Unlike tab 1 the body
is **not** inset: the 360-wide form sits in the full 390 with
`margin: 0 15px`. Submit never talks to gc987.com —
`registerSubordinate` is mock only.

### Form card — 360×740 @(15,104)

`p-[10px] h-full rounded-[.625rem]`, background `#101629`, radius 10.
Inner `ion-content` 340×720 @(25,114). `scrollHeight` 740 on an empty
form, so the outer `/spread` scroller does not move.

### Hint — `.illustrate` 340×28 @(25,134)

`width: 21.25rem`, `margin: 1.25rem auto`, `padding: 0 0.4rem`, 12px/14px
white: `Preencha as informações a seguir para concluir a abertura da conta.`

### Phone — ion-item 340×48 @(25,182), `mb-[10px]`

Input bar `#090f1f`, radius 10, 12px. Brazil flag `fi-br` 20×20 @(35,193.5)
radius 12, `mr-2`. `+55` `.register-tips.pl-2` @(63,196.25) with
`border-left: 2px solid #fff` and computed color `rgb(135, 146, 175)` (the
Tailwind `#9BA7BE` class does not win). The dial is not a picker. Placeholder `Telefone` `#8792af`. `type=tel`,
**maxlength 11**, digits only. Clear `ionicon close-circle` 30×30 when the
field has a value.

Exactly **11 digits** is valid. 10 digits or `"1"` → red
`*Número de telefone inválido` 10px/15px `rgb(255,0,0)`, item grows
48→60, error padding `5px 0 0 10px` @(35,227). Errors paint after
blur/submit, not on first keystroke.

### Senha / Confirmar senha — 340×48 @(25,240) and @(25,298)

Placeholders `Senha` / `Confirmar senha`. Eye overlay
`absolute min-h-[36px] top-[4px] right-[6px]`, icon 20×20
`rgb(109,120,141)`. Hidden (`type=password`) is an open eye; visible
(`type=text`) is the same eye plus a slash `stroke="#9BA7BE"`. Password
must be **6–16 characters** or the same red `6-16 caracteres` style.
Confirm has **no inline error** — a mismatch on Criar is toast-only.

### Criar — 250×40 @(70,388)

`ion-item.submit.drop-shadow-[0_4px_15px_rgba(32,139,229,0.25)].mt-[2rem].mx-auto.w-[15.625rem]`,
gradient `linear-gradient(0deg, #0167CA 0%, #38A8FA 100%)`, radius 10.
Inner label 14px/500 white. Empty submit fires field errors only (no
toast). Mismatch → `ion-toast` middle 2000ms:
`As senhas inseridas duas vezes não correspondem`. Wrapper 288×72
@(51,386), bg `#1a1d22`, radius 8, content pad 15, message 14px/21px
`rgb(244,245,248)` centre, `--max-width: 18rem`. Live success toast was
not captured (that would hit the real agent API); the clone uses
`Registro realizado com sucesso` then clears the form.

## Not yet cloned

- The Comissão date range and category filter run through the mock, which has
  no rows, so neither ever changes the empty state.
- The datetime's year picker (tapping the month label on the live page swaps
  the day grid for Ionic's month/year wheel). The clone renders the caret but
  the toggle is inert.
- The Desempenho search box filters through the mock, which has no rows, so
  typing an ID never changes the empty state.
- The QR bitmap (client-side canvas over the real referral link).
- Receber / Histórico / Salvar / share targets / copy are inert; the live ones
  hit the agent API or the OS share sheet.
- The site-wide 30x30 floating ball that `body` carries on every route is still
  missing project-wide (also noted in the `/user/report` spec).
