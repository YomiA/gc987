# /game/search/:provider

Source: `https://gc987.com/game/search/POPULAR` (opened from `https://gc987.com/main/inicio` header magnifier).

This is **not** an overlay on `/main/inicio`. Clicking the top-bar search changes the pathname. Local route: `/game/search/:provider?` (default `POPULAR`).

`<page-key>`: `game-search`

## Shell
- `.ion-page.search-container` stacked above the hidden home page (`z-index: 101`, `can-go-back`).
- **No TabBar** on this page (`ion-tab-bar` is 0×0, left on the hidden home tree).
- No support FAB, no to-top, no PWA sheet on this stack.
- Viewport recorded at **390×844×3**; root font-size 16px (1rem = 16px).

## Regions (top → bottom)
1. **Header** (112px) — `SearchHeader`
   - ios toolbar 50px, `--color-bg-400`, title **Pesquisar** 20px/600
   - md searchbar row 56px with 6px top margin; field **Buscar juegos**
2. **Segment** (53.67px) — `SearchSegment` inside the scroller (scrolls with the grid)
   - Pesquisar / Popular / Recente / Favoritos
3. **Grid or empty** — `SearchGameGrid` / `SearchEmpty`
   - Popular: 3-column `style2` cards (100 on live `home.hot`; mock uses unique catalog from `home.gameBlocks`)
   - Recente / Favoritos: empty while logged out
   - Pesquisar: empty until the query matches a name

## Interaction model
Click (back, tabs, clear). Input (filter → SEARCH). Scroll (segment + grid). Not time-driven. Not a click-tab substitute for scroll.

## Tokens
Mapped: `--color-bar-bg`, `--color-bg-400`, `--color-text-100`, `--divider`, `--search-blue`. Idle tab `rgb(109, 120, 142)` is local (1 off `--text-dim`). No `tokens.css` edits.

## Router
New path declared above the catch-all. Existing routes untouched.
