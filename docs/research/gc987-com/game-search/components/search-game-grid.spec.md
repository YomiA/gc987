# SearchGameGrid

Source: `.search-container ion-grid.game-box` at 390×844×3, Popular tab.

## Grid
- `ion-grid.game-box`: padding **4px**, width 390
- `ion-row`: width 382, wrap
- `ion-col`: flex `0 0 33.3333%` (127.33), padding **4px**, min-height 1px
- Card: 119.33×161.09, `border-radius: 12.5% / 9.25%`, bg `--game-card-bg`
- Live Popular listed **100** `.game-card` nodes (`home.hot` pageSize 2000). Clone shows unique games from `home.gameBlocks` (same thumbnails as inicio).

## Card chrome (same as homepage `GameCard` popular)
- Cover `ion-img.game-img` absolute inset
- `.platform-icon` 22×22, bottom 3px, `translateX(-11px)`, white
- `.svg-icon.favorite` 18×18, top/right 8px, `color: transparent`, shadow `rgba(0,0,0,0.4) 0 2px 5px`
- `.game-name` height 0 (names are in the artwork)

Reuse `GameCard` with `layout="search"` (width 100% inside the cell). Not a second card component.
