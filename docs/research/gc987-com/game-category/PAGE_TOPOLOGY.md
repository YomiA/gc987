# /game/category/:gameType/:platformId

Source: `https://gc987.com/game/category/ELECTRONIC/0` at **390×844×3**.

Live `GameCategory` (`Tte`, `data-v-ed5e4738`). Local route:
`/game/category/:gameType/:platformId?` (default platform `0` = all).

`<page-key>`: `game-category`

## Shell
- `.ion-page.category-container`. **No TabBar**, no support FAB.
- Header **112px**, bg `#090f1f`.
- Body is a row: left rail **85×732** @(0, 112) + main **305** wide.

## Regions (top → bottom)
1. **Header** — reuse `SearchHeader`
   - ios toolbar 50px, title **Slot** (`sort.ELECTRONIC`) 20px/600, pad 0 90px
   - md searchbar 56px; field @(8, 64) 374×40, radius 5, bg `#101629`
   - placeholder **PesquisarJogos**, `::placeholder` white / 0.6
2. **Rail** — `CategoryRail` (`ion-content.side`)
   - inner pad-left 10px; buttons 75×62, margin-bottom 16px, radius 6px
   - ALL: `/icons/sort/ELECTRONIC_on.png` 38×38, label **TodosSlot** 12px/16/500
   - idle fill `#191e2d`; checked fill `--color-bg-tab-on`
   - idle platform glyph opacity 0.4
3. **Sort tabs** — `CategorySortTabs` @(95, 114) 285×35.33
   - grid 4×, gap 8px, margin 0 10px 5px
   - buttons 65.25×31.33, radius 7; idle border `--divider`; checked `#116fcd`
   - Todos / Popular / Recente / Favoritos
4. **Grid or empty** — `CategoryGameGrid` / `SearchEmpty`
   - `ion-grid` pad 0 5px; `ion-col.card-col` 33.3333%, pad 0 5px 10px
   - style2 card 88.32×119.23 @(95, 154.33)
   - Recente / Favoritos empty (`Nenhum jogo disponível`) while logged out

## Tokens
Mapped: `--color-bar-bg`, `--color-bg-400`, `--color-text-100`, `--divider`,
`--color-bg-tab-on`. Local: rail idle `#191e2d`, tab checked `#116fcd`.

## Router
Declared above the catch-all. Homepage **Mostrar tudo** on non-Popular
blocks and footer **Marca de games** push this path. Popular **Mostrar tudo**
opens `/game/search/POPULAR`.
