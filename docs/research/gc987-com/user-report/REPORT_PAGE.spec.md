# /user/report (Relatórios) — extraction spec

Everything below was read off `https://gc987.com/user/report` in the signed-in
Chrome DevTools session at `390x844x3, mobile, touch`. Geometry is
`getBoundingClientRect`, styling is `getComputedStyle` (plus the matching source
rules pulled from `document.styleSheets`, which is how the rem-vs-px split below
is known rather than guessed). `ion-*` values come from their shadow roots.

Reached from `/main/perfil` → **Relatórios**: a plain route push, no overlay.

Local route: `/user/report` (source pathname preserved).

## Shell

| box | geometry | notes |
| --- | --- | --- |
| `div.ion-page` | 390x844 | `flex column`, no tab bar on this route |
| `ion-header` | 390x101 | `position: relative; z-index: 10`, md elevation-4 shadow, own background transparent |
| `ion-toolbar` (`ios` mode) | 390x50 | `--background: #154084`, `--min-height: 3.125rem`, `--padding-start/end: 4px`, `--border-width: 0` |
| `ion-segment.segment-scrollable` | 358x51 at (16,50) | `border-bottom: 1px solid rgb(26,35,62)`, horizontally scrollable |
| `ion-content` | 390x743 at (0,101) | `--background: #090f1f`, no padding |

Header shadow: `0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14),
0 1px 10px 0 rgba(0,0,0,.12)`.

### Toolbar contents

- Back `ion-button` 38x22 at (6,14); inside it an `ion-icon` 16x16 at (16,17),
  `color: #fff`. Custom glyph, not an ionicon:
  `viewBox 0 0 24 24`, `path d="M16 4L8.77645 10.8043C8.35597 11.2004 8.35756
  11.8693 8.77992 12.2634L16 19"`, `stroke: currentColor; stroke-width: 1.5;
  stroke-linecap: round`.
- `ion-title` "Relatórios": `position: absolute`, inset 0, `padding: 0 90px`,
  `font: 400 20px/30px`, `text-align: center`. Inner `.toolbar-title` 210x30 at
  (90,10), `overflow: hidden; white-space: nowrap`.

### Segment

Five buttons, `font-size: 14px`, `line-height: 40px`, height 50,
`text-transform: capitalize` (so "Detalhes da Conta" paints as "Detalhes Da
Conta"), `margin-right: 12.8px` (0.8rem), `--padding-start/end: 0`,
`--color: rgba(255,255,255,.6)`, `--color-checked: #38a8fa`, native button
`transition: color .15s linear`.

Intrinsic widths at 14px: 115.34 / 133.71 / 106.27 / 55.63 / 41.75.

Indicator: `.segment-button-indicator` 2px tall at `top: 48px`, width = button
width, `background-color: rgb(56, 168, 250)`, `opacity` 1 on the checked button
and 0 elsewhere, `transition: transform .25s cubic-bezier(.4,0,.2,1)` (Ionic
FLIPs it from the previous button's box, i.e. the underline slides + resizes).

Scrolling: activating a button scrolls it into view with *nearest* alignment,
not centering. With "Outros" checked, `scrollLeft` is 145.89 =
`btn.offsetLeft + btn.offsetWidth - clientWidth` (503.89 - 358).

## Per-tab body

`ion-content > div.statement` (tabs 1, 5) or `div.bet` (tabs 2-4), 390x743,
`flex column`:

1. `div.top` — `margin: .625rem 0`, holds `div.select-scroll`
   (`display: flex; padding: 0 1rem; overflow-x: auto; font-size: .75rem`,
   `::-webkit-scrollbar { display: none }`).
2. `ion-content.list` — `flex: 1 1 0%`, `--padding-start/end: 1rem`,
   `--background: #090f1f`, scrolls vertically.
3. `ion-row.footer-count` — only on tabs 1 and 4.

| # | tab | wrapper | filters | footer |
| --- | --- | --- | --- | --- |
| 1 | Detalhes da Conta | `statement` | date, tipos (8), detalhes (1) | yes |
| 2 | Recordes de Apostas | `bet` | date, tipos (5), plataformas (1), jogos (1) | no |
| 3 | Aposta Esportiva | `bet` | date, plataformas (1), jogos (1) | no |
| 4 | Relatório | `bet` | date, tipos (5), plataformas (1), jogos (1) | yes |
| 5 | Outros | `statement` | date, detalhes (3) | no |

All five tabs render the empty state for this account.

### Filter pill (`div.filter`)

`display: flex; justify-content: space-between; align-items: center`,
`padding: 4px 4px 4px 8px`, `border: .0625rem solid rgb(109,120,141)`,
`border-radius: 10px`, `margin-right: 10px`, `color: #fff`.
Open state: `border-color: rgb(255,255,255)`.

- `.typeName` — `display: flex; align-items: center; margin-right: .5rem`,
  `white-space: nowrap`, 12px.
- `ion-icon.report-select-icon` — 1rem square, `color: rgb(109,120,141)`,
  `transition: transform .1s linear`; gets class `on` →
  `transform: rotate(180deg)`. Glyph is ionicons `caret-down`.

Pill heights differ only through inherited line-height: `statement-select-default`
is 12px/18px → 28 tall, `betting-select-default` is 12px/16px → 26 tall.

`Hoje` measures 62.64 wide = 8 + 24.64 + 8 + 16 + 4 + 2·1.

### Filter popover (`ion-popover` md)

`--width: 390px`, `--backdrop-opacity: 0` (invisible, still dismisses on tap).
`.popover-content` at (0, pill bottom) — 139 on `statement` tabs, 137 on `bet`
tabs — `background: #090f1f`, `border-radius: 4px`, md elevation-8 shadow
`0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px
rgba(0,0,0,.12)`, `transform-origin: 0 0`, `overflow-y: auto`.

- `ion-row` — fills the panel, `background: rgb(16,22,41)`,
  `padding: 6px 10px`, `flex-wrap: wrap`, `font: 12px/18px`, `text-align: center`.
- `ion-col.select-col` — `flex: 0 0 25%` (92.5 wide), `line-height: .75rem`,
  `padding: 0 .3125rem .3125rem 0`; every 4th column drops the right padding
  (`padding: 0 0 .3125rem`) so the row's last option reaches the content edge.
- `p` — 40 tall (2.5rem), `padding: 0 .25rem`, flex-centered,
  `border-radius: .375rem`. Off: `border: 1px solid rgb(109,120,141)`,
  `color: rgb(109,120,141)`. On: `border-width: 0`, `color: #fff`,
  `background-image: linear-gradient(0deg, rgb(1,103,202) 0%, rgb(56,168,250) 100%)`.

Panel heights: 1 row of options → 57, 2 rows → 102 (6 + 45·n + 6).

Animation is Ionic's md popover pair: enter scales the content 0.8 → 1 over
300ms `cubic-bezier(.36,.66,.04,1)` while the wrapper fades in over 150ms; leave
only fades, 150ms `ease`.

Picking an option closes the panel and rewrites the pill label.

### Options

- date (every tab): Hoje\* / Últimos 3 Dias / Últimos 5 Dias / Últimos 7 Dias
- tipos, tab 1: Todos Tipos\* / Depósito de Membro / Saque / Eventos / Troca de
  fundos / Cofre box / Comissão / Tarefas
- detalhes, tab 1: Todos Detalhes\*
- tipos, tabs 2 and 4: Todos Tipos\* / Slot / Pesca / Cassino / Cartas
- plataformas, tabs 2-4: Todas Plataformas\*
- jogos, tabs 2-4: Todos Jogos\*
- detalhes, tab 5: Todos Detalhes\* / Gorjeta no Jogo / Reembolsado

\* = default.

### Empty state

```css
.empty { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.statement .list .empty { height: 100%; }
.empty-box { height: calc(100% - 6.16rem); }   /* the .bet tabs */
.empty .empty-bg-img { width: 7.5rem; height: 7.5rem; }
.empty-bg-img { background: url("/icons/No_record.png") 0% 0% / 7.5rem auto no-repeat transparent; }
.empty ion-label { color: rgb(146,148,156); }  /* 16px/24px "Sem Registros" */
```

`No_record.png` is already in this project as
`public/images/promo-page/no-record.png` (same source file, downloaded for the
promo Histórico panel), so it is reused instead of downloaded again.

### Footer summary (`ion-row.footer-count`)

`padding: .625rem`, `background: rgb(26,34,58)` (= `--color-bg-200`),
`font: 12px/16px`; inner `ion-col` `padding: .3125rem`; rows are
`.content-flex { display: flex; justify-content: space-between }` with
`margin-top: .625rem` from the second row on.

Tab 1 (128 tall at y=716) — labels `rgb(135,146,175)`, each value carries
`margin-top: .625rem` (making the rows 26 tall):

| label | value | colour |
| --- | --- | --- |
| Depósito Total： | 0,00 | `rgb(39,212,139)` |
| Retirada Total： | 0,00 | `rgb(238,70,57)` |
| Total de Descontos Recebidos： | 0,00 | `rgb(251,165,49)` |

Tab 4 (98 tall at y=746) — labels `#fff`, values have no margin (rows 16 tall):

| label | value | colour |
| --- | --- | --- |
| Total de Apostas： | 0 | `#fff` |
| Aposta válida total： | 0,00 | `#fff` |
| Total de Ganhos/Perdas： | 0 | `rgb(251,165,49)` |

Labels end with the fullwidth colon `：` (U+FF1A).

## Not cloned

`body > div.box.xuanfu.touming > input.boxButton` — a 30x30 draggable widget
parked half off-screen at (-10,200). It is a body-level global on the live site,
not part of this page, and this clone has no equivalent on any route yet.
